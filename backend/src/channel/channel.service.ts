import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import postgresErrorCode from '../database/postgresErrorCodes';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import CreateChannelDto from './dtos/channel.create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Channel from './channel.entity';
import { chanNewTypeDto, messageReqDto, muteUserDto } from './dtos/channel.dto';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel) private channelRepo: Repository<Channel>,
        private usersService: UserService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
    }

    async create(channelData: CreateChannelDto) {
        const newUser = await this.channelRepo.create(channelData);
        await this.channelRepo.save(newUser);
        return newUser;
    }

    async addElement(data: string, newElem: any) {
        let tab = [];
        if (data !== '') tab = await JSON.parse(data);
        tab.push(newElem);
        return JSON.stringify(tab);
    }

    async removeElement(data: string, tag: string, value: string) {
        let tab = [];
        if (data !== '') tab = await JSON.parse(data);
        for (let i = 0; tab.length; i++) {
            if (tab[i][tag] == value) {
                tab.splice(i, 1);
                return JSON.stringify(tab);
            }
        }
        return JSON.stringify(tab);
    }

    async createChannel(channelData: CreateChannelDto) {
        try {
            const hashedPassword = await bcrypt.hash(channelData.password, 12);
            const owner = await this.addElement('', {id: channelData.owners});
            const channel = await this.create({
                owners: owner,
                channelname: channelData.channelname,
                password: hashedPassword,
                type: channelData.type,
                msghist: '',
                mutedusers: '',
                bannedusers: '',
                channelusers: owner,
                owner: channelData.owners,
            });
            channel.password = undefined;
            return channel;
        } catch (e) {
            if (e?.code === postgresErrorCode.UniqueViolation) {
                throw new HttpException(
                    'Channel name already taken',
                    HttpStatus.BAD_REQUEST,
                );
            }
            console.log(e)
            throw new HttpException(
                'Something went wrong',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getUserChannel(id: string) {
        const userChannel = [];
        const all = await this.channelRepo.query(
            `SELECT id, channelname, type, channelusers
             FROM public."channel"`,
        );
        for (let i = 0; all[i]; i++) {
            const chanData = await JSON.parse(all[i].channelusers);
            for (let j = 0; j < chanData.length; j++) {
                if (chanData[j].id == id) {
                    userChannel.push(all[i]);
                }
            }
        }
        return JSON.stringify(userChannel);
    }

    async getChannelWithoutUser(id: string) {
        const channelWithoutUser = [];
        const all = await this.channelRepo.query(
            `SELECT id, channelname, type, channelusers
             FROM public."channel"`,
        );
        for (let i = 0; all[i]; i++) {
            if (all[i].type != 2) {
                const chanData = await JSON.parse(all[i].channelusers);
                for (let j = 0; j <= chanData.length; j++) {
                    if (chanData.length == j) {
                        all[i].channelusers = j.toString();
                        channelWithoutUser.push(all[i]);
                        break;
                    }
                    if (chanData[j].id == id) {
                        break;
                    }
                }
            }
        }
        return JSON.stringify(channelWithoutUser);
    }

    async findChannelById(id: string, userTrig = '') {
        const channel = await this.channelRepo.findOneBy({id});
        if (channel) {
            channel.password = userTrig;
            return channel;
        }
        throw new HttpException(
            'Channel with this id does no exist',
            HttpStatus.NOT_FOUND,
        );
    }

    async isUserIn(list: string, id: string) {
        if (!list) return false;
        const json = JSON.parse(list);
        for (let i = 0; json[i]; i++) {
            if (json[i].id == id) {
                return true;
            }
        }
        return false;
    }

    async removeFormList(list: string, id: string) {
        if (!list) return list;
        const json = JSON.parse(list);
        for (let i = 0; json[i]; i++) {
            if (json[i].id == id) {
                json.splice(i, 1);
                return JSON.stringify(json);
            }
        }
        return list;
    }

    async addList(
        list: string,
        id: string,
        object = {id: 'unset', time: 0, message: '', displayname: ''},
    ) {
        let json = [];
        if (list) json = JSON.parse(list);
        if (object?.time !== 0) json.push(object);
        else json.push({id: id});
        return JSON.stringify(json);
    }

    async addListMsg(
        list: string,
        id: string,
        object = {id: 'unset', time: 0, message: '', displayname: ''},
    ) {
        let json = [];
        if (list) json = JSON.parse(list);
        if (object?.time !== 0) json.push(object);
        else json.push({id: id});
        return JSON.stringify(json);
    }

    private async verifyPassword(
        plainTextPassword: string,
        hashoedPassword: string,
    ) {
        const arePasswordMatching = await bcrypt.compare(
            plainTextPassword,
            hashoedPassword,
        );
        if (!arePasswordMatching) {
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async userJoinChannel(userId: string, id: string, channelPW: string) {
        const channel: Channel = await this.channelRepo.findOneBy({id});
        if (channel.type == 3)
            await this.verifyPassword(channelPW, channel.password);
        let chanUsr = [];
        chanUsr = JSON.parse(channel.channelusers);
        if (await this.isUserIn(channel.bannedusers, userId))
            throw new HttpException("You are banned form this channel", HttpStatus.INTERNAL_SERVER_ERROR,);
        if (await this.isUserIn(channel.channelusers, userId))
            throw new HttpException("User is already in this channel", HttpStatus.INTERNAL_SERVER_ERROR,);
        chanUsr.push({id: userId});
        channel.channelusers = JSON.stringify(chanUsr);
        await this.channelRepo.save(channel);
        return channel.id;
    }

    async changeChannelType(chanInfo: chanNewTypeDto, idUser: string) {
        const channel = await this.channelRepo.findOneBy({id: chanInfo.id});
        if (!channel)
            throw new HttpException("Channel with this id does no exist", HttpStatus.NOT_FOUND,);
        if (await this.isUserIn(channel.owners, idUser) == false)
            throw new HttpException("User is not administrator", HttpStatus.UNAUTHORIZED,);
        if (channel.type == chanInfo.type)
            throw new HttpException("The channel is already in this category", HttpStatus.UNAUTHORIZED,);
        if (chanInfo.type == 3) {
            const hashedPassword = await bcrypt.hash(chanInfo.password, 12);
            channel.password = hashedPassword;
        }
        channel.type = chanInfo.type;
        await this.channelRepo.save(channel);
        return true;
    }


  async inviteUserChannel(
    userTrig: string,
    userToInvite: string,
    chanId: string,
  ) {
    const channel: Channel = await this.channelRepo.findOneBy({ id: chanId });
    let chanUsr = [];
    chanUsr = JSON.parse(channel.channelusers);
    const userToInv = await this.usersService.findByDisplayname(userToInvite);
    if ((await this.isUserIn(channel.owners, userTrig)) == false)
      throw new HttpException(
        'You are not channel administrator',
        HttpStatus.CONFLICT,
      );
    if (await this.isUserIn(channel.bannedusers, userToInv))
      throw new HttpException(
        'User is blocked in this channel',
        HttpStatus.CONFLICT,
      );
    if (await this.isUserIn(channel.channelusers, userToInv))
      throw new HttpException(
        'User is already in this channel',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    chanUsr.push({ id: userToInv });
    channel.channelusers = JSON.stringify(chanUsr);
    await this.channelRepo.save(channel);
    return true;
  }
  async kickUserChannel(
    userTrig: string,
    userToInvite: string,
    chanId: string,
  ) {
    const channel: Channel = await this.channelRepo.findOneBy({ id: chanId });
    const userToKick = await this.usersService.findByDisplayname(userToInvite);
    if (channel.owner == userToKick)
      throw new HttpException(
        'Impossible to kick channel owner',
        HttpStatus.CONFLICT,
      );
    if ((await this.isUserIn(channel.owners, userTrig)) == false)
      throw new HttpException(
        'You are not channel administrator',
        HttpStatus.CONFLICT,
      );
    if ((await this.isUserIn(channel.channelusers, userToKick)) == false)
      throw new HttpException(
        'User is not in this channel',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    channel.channelusers = await this.removeFormList(
      channel.channelusers,
      userToKick,
    );
    await this.channelRepo.save(channel);
    return true;
  }
  async banUserChannel(userTrig: string, userToInvite: string, chanId: string) {
    const channel: Channel = await this.channelRepo.findOneBy({ id: chanId });
    const userToBan = await this.usersService.findByDisplayname(userToInvite);
    if (channel.owner == userToBan)
      throw new HttpException(
        'Impossible to kick channel owner',
        HttpStatus.CONFLICT,
      );
    if ((await this.isUserIn(channel.owners, userTrig)) == false)
      throw new HttpException(
        'You are not channel administrator',
        HttpStatus.CONFLICT,
      );
    if (await this.isUserIn(channel.bannedusers, userToBan))
      throw new HttpException(
        'User is already banned',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    channel.bannedusers = await this.addList(channel.bannedusers, userToBan);
    channel.channelusers = await this.removeFormList(
      channel.channelusers,
      userToBan,
    );
    await this.channelRepo.save(channel);
    return true;
  }

  async unbanUserChannel(
    userTrig: string,
    userToInvite: string,
    chanId: string,
  ) {
    const channel: Channel = await this.channelRepo.findOneBy({ id: chanId });
    const userToBan = await this.usersService.findByDisplayname(userToInvite);
    if ((await this.isUserIn(channel.owners, userTrig)) == false)
      throw new HttpException(
        'You are not channel administrator',
        HttpStatus.CONFLICT,
      );
    if ((await this.isUserIn(channel.bannedusers, userToBan)) == false)
      throw new HttpException(
        'User not banned form this channel',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    channel.bannedusers = await this.removeFormList(
      channel.bannedusers,
      userToBan,
    );
    await this.channelRepo.save(channel);
    return true;
  }

  async leaveChannel(userTrig: string, chanId: string) {
    const channel: Channel = await this.channelRepo.findOneBy({ id: chanId });
    if (channel.owner == userTrig) {
      let chanOwn = [],
        i = -1;
      chanOwn = JSON.parse(channel.owners);
      while (chanOwn[++i]) {}
      if (i <= 1)
        throw new HttpException(
          'Impossible to leave as solo administrator',
          HttpStatus.CONFLICT,
        );
      else {
        i = -1;
        while (chanOwn[++i]) {
          if (chanOwn[i].id == userTrig) {
            chanOwn.splice(i, 1);
          }
        }
        channel.owner = chanOwn[0].id;
        channel.owners = JSON.stringify(chanOwn);
      }
    }
    channel.channelusers = await this.removeFormList(
      channel.channelusers,
      userTrig,
    );
    await this.channelRepo.save(channel);
    return true;
  }
  async addAdministrator(
    userTrig: string,
    userToInvite: string,
    chanId: string,
  ) {
    const channel: Channel = await this.channelRepo.findOneBy({ id: chanId });
    let chanUsr = [];
    chanUsr = JSON.parse(channel.channelusers);
    const userToInv = await this.usersService.findByDisplayname(userToInvite);
    if ((await this.isUserIn(channel.owners, userTrig)) == false)
      throw new HttpException(
        'You are not channel administrator',
        HttpStatus.CONFLICT,
      );
    if (await this.isUserIn(channel.owners, userToInv))
      throw new HttpException(
        'User is already administrator',
        HttpStatus.CONFLICT,
      );
    if (await this.isUserIn(channel.bannedusers, userToInv))
      throw new HttpException(
        'User is ban in this channel',
        HttpStatus.CONFLICT,
      );
    channel.owners = await this.addList(channel.owners, userToInv);
    await this.channelRepo.save(channel);
    return true;
  }
  async removeAdministrator(
    userTrig: string,
    userToInvite: string,
    chanId: string,
  ) {
    const channel: Channel = await this.channelRepo.findOneBy({ id: chanId });
    let chanUsr = [];
    chanUsr = JSON.parse(channel.channelusers);
    const userToInv = await this.usersService.findByDisplayname(userToInvite);
    if ((await this.isUserIn(channel.owners, userTrig)) == false)
      throw new HttpException(
        'You are not channel administrator',
        HttpStatus.CONFLICT,
      );
    if ((await this.isUserIn(channel.owners, userToInv)) == false)
      throw new HttpException('User is not administrator', HttpStatus.CONFLICT);
    channel.owners = await this.removeFormList(channel.owners, userToInv);
    await this.channelRepo.save(channel);
    return true;
  }


    async muteUser (userTrig: string, muteData: muteUserDto) {
        const channel: Channel = await this.channelRepo.findOneBy({id: muteData.chanId});
        let chanMute = [];
        const date = new Date().getTime();
        if (channel.mutedusers)
            chanMute = JSON.parse(channel.mutedusers);
        const userToMute = await this.usersService.findByDisplayname(muteData.id);
        if (await this.isUserIn(channel.owners, userTrig) == false)
            throw new HttpException("You are not channel administrator", HttpStatus.CONFLICT,);
        // if (await this.isUserIn(channel.owners, userToMute))
        //     throw new HttpException("You cant mute administrator", HttpStatus.CONFLICT,);
        for (let i = 0; chanMute[i]; i++) {
            const number: number = chanMute[i].time
            if (number < date){
                chanMute.splice(i, 1);
                i = 0;
            }
        }
        channel.mutedusers = JSON.stringify(chanMute);
        channel.mutedusers = await this.addList(channel.mutedusers, muteData.id, {id: muteData.id, time: muteData.time, message: '', displayname: ''})
        await this.channelRepo.save(channel);
        return true;
    }

  async newMessage(userTrig: string, messageData: messageReqDto) {
    const channel: Channel = await this.channelRepo.findOneBy({
      id: messageData.chanId,
    });
    const user = await this.usersService.findByDisplayname(userTrig);
    let muted = [];
    if (channel.mutedusers) muted = JSON.parse(channel.mutedusers);
    if (muted) {
      const time = new Date().getTime();
      for (let i = 0; muted[i]; i++) {
        const timeMute: number = muted[i].time;
        if (muted[i].id == userTrig && time < timeMute) {
          const timeLeft: number = (muted[i].time - time) / 1000;
          throw new HttpException(
            `You are muted for ${timeLeft}s`,
            HttpStatus.CONFLICT,
          );
        }
      }
    }
    channel.msghist = await this.addList(channel.msghist, user, {
      id: user,
      time: messageData.time,
      message: messageData.message,
      displayname: messageData.displayname,
    });
    await this.channelRepo.save(channel);
    return true;
  }

  async getMsgHistory(userTrig: string, userToInvite: string, chanId: string) {
    const channel: Channel = await this.channelRepo.findOneBy({ id: chanId });
    const user = await this.usersService.findById(userTrig);
    const msg = [];
    let chanMsg = [];
    if (channel.msghist) chanMsg = JSON.parse(channel.msghist);
    for (let i = 0; chanMsg[i]; i++) {
      if ((await this.isUserIn(user.blocked, chanMsg[i].id)) == false) {
        msg.push(chanMsg[i]);
      }
    }
    return msg;
  }
}
