import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as bcrypt from "bcrypt";
import postgresErrorCode from "../database/postgresErrorCodes";
import {UserService} from "../user/user.service";
import {ConfigService} from "@nestjs/config";
import {HttpService} from "@nestjs/axios";
import CreateChannelDto from "./dtos/channel.create.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import Channel from "./channel.entity";

@Injectable()
export class ChannelService {
    constructor(@InjectRepository(Channel) private channelRepo: Repository<Channel>,
                private usersService: UserService,
                private readonly configService: ConfigService,
                private readonly httpService: HttpService) {}

    async  create(channelData: CreateChannelDto) {
        const newUser = await this.channelRepo.create(channelData);
        await this.channelRepo.save(newUser);
        return newUser;
    }

    async addElement(data: string, newElem: {}) {
        let tab = [];
        if (data !== '')
            tab = await JSON.parse(data);
        tab.push(newElem);
        return JSON.stringify(tab);
    }

    async removeElement(data: string, tag: string, value: string) {
        let tab = [];
        if (data !== '')
            tab = await JSON.parse(data);
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
                channelusers: owner
            });
            channel.password = undefined;
            return channel;
        } catch (e) {
            if (e?.code === postgresErrorCode.UniqueViolation) {
                throw new HttpException('Channel name already taken', HttpStatus.BAD_REQUEST);
            }
            console.log(e)
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
        }
    }

    async getUserChannel (id: string) {
        const userChannel = [];
        const all = await this.channelRepo.query(`SELECT id, channelname, type, channelusers FROM public."channel"`)
        for (let i = 0; all[i]; i++) {
            const chanData = await JSON.parse(all[i].channelusers);
            for (let j = 0; j < chanData.length; j++) {
                if (chanData[j].id == id) {
                    userChannel.push(all[i]);
                }
            }
        }
        return (JSON.stringify(userChannel));
    }

    async getChannelWithoutUser (id: string) {
        const channelWithoutUser = [];
        const all = await this.channelRepo.query(`SELECT id, channelname, type, channelusers FROM public."channel"`)
        for (let i = 0; all[i]; i++) {
                if (all[i].type != 2) {
                const chanData = await JSON.parse(all[i].channelusers);
                for (let j = 0; j <= chanData.length; j++) {
                    if (chanData.length == j) {
                        all[i].channelusers = j.toString();
                        channelWithoutUser.push(all[i]);
                        break;
                    }
                    if(chanData[j].id == id){
                        break;
                    }
                }
            }
        }
        return (JSON.stringify(channelWithoutUser));
    }

    async findChannelById (id: string) {
        const channel = await this.channelRepo.findOneBy({id});
        if (channel) {
            channel.password = '';
            return channel;
        }
        throw new HttpException("Channel with this id does no exist", HttpStatus.NOT_FOUND,);
    }

    async isUserIn (list: string, id: string) {
        if (!list)
            return false;
        const json = JSON.parse(JSON.stringify(list));
        for (let i = 0; json[i]; i++) {
            if (json.id == id) {
                return true;
            }
        }
        return false;
    }
    private async verifyPassword(plainTextPassword: string, hashoedPassword: string) {
        const arePasswordMatching = await bcrypt.compare(plainTextPassword, hashoedPassword);
        if (!arePasswordMatching) {
            throw new HttpException('Wrong credentials provided', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async userJoinChannel (userId: string, id: string, channelPW: string) {
        const channel: Channel = await this.channelRepo.findOneBy({id});
        if (channel.type == 3)
            await this.verifyPassword(channelPW, channel.password);
        let chanUsr = [];
        chanUsr = JSON.parse(channel.channelusers);
        if (await this.isUserIn(channel.bannedusers, userId))
            throw new HttpException("User is blocked in this channel", HttpStatus.INTERNAL_SERVER_ERROR,);
        if (await this.isUserIn(channel.channelusers, userId))
            throw new HttpException("User is already in this channel", HttpStatus.INTERNAL_SERVER_ERROR,);
        chanUsr.push({id: userId});
        channel.channelusers = JSON.stringify(chanUsr);
        await this.channelRepo.save(channel);
        return channel.id;
    }

}
