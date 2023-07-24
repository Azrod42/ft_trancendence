import JwtAuthGuard from 'src/auth/jwtAuth.guard';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import {
  ChangeDisplayName,
  ChangeDisplayNameDto,
  messageUser,
  UserId,
} from './dtos/user.changedisplay.dto';
import RequestWithUser from 'src/auth/interface/requestWithUser.i';
import { Response } from 'express';
import { validate } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as process from 'process';
import * as fs from 'fs';
import { socketId } from '../user/dtos/user.changedisplay.dto';
import {
  chanIdDto,
  idNumberDto,
  inviteToChannelDto,
  messageReqDto,
  muteUserDto,
  newGameDto,
} from '../channel/dtos/channel.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('hello')
  async findUser() {
    return 'hello world';
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('getuserdata')
  async getuserdata(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const userData = await this.userService.findById(request.user.id);
    return response.send(userData);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('displayname')
  async changeDisplayName(
    @Req() request: RequestWithUser,
    @Body() newData: ChangeDisplayName,
  ) {
    let ret = {};
    const data: ChangeDisplayNameDto = new ChangeDisplayNameDto();
    data.displayname = newData.displayname;
    await validate(data).then((errors) => {
      if (errors.length > 0) {
        console.log(errors)
        ret = errors;
        return ret;
      }
      ret = data;
    });
    await this.userService.updateDisplayName(request?.user.id, newData);
    return ret;
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profileimage',
        filename(
          req,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) {
          const filename: string = uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          callback(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  async uploadFile(@Req() request: RequestWithUser, @UploadedFile() file) {
    if (!request.user || !file) return;
    //remove image if user already have one
    const userProfile = await this.userService.findById(request.user.id);
    fs.unlink(process.cwd() + '\\' + userProfile.avatar, (err) => {
      if (err) {
        console.log(err);
      }
    });
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    return this.userService.updateAvatar(request.user.id, file.path);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('profile-picture')
  async findProfileImage(@Req() request: RequestWithUser, @Res() res) {
    if (!request.user)
      throw new HttpException(
        'Somthing went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    const id: string = await this.userService.getAvatarID(request.user.id);
    //transform img to base64 (see frontend profile page use)
    let bitmaps;
    try {
      bitmaps = fs.readFileSync(process.cwd() + '/' + id);
    } catch (e) {
      bitmaps = fs.readFileSync(process.cwd() + '/uploads/default-avatar.jpeg');
    }
    //-=-=-=-=-=-=-=-=-=-=-=-=
    return res.send(bitmaps.toString('base64'));
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('post-profile-picture')
  async postProfilePicture(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() userId: UserId,
  ) {
    const id: string = await this.userService.getAvatarID(userId?.id);
    //transform img to base64 (see frontend profile page use)
    let bitmaps;
    try {
      bitmaps = fs.readFileSync(process.cwd() + '/' + id);
    } catch (e) {
      bitmaps = fs.readFileSync(process.cwd() + '/uploads/default-avatar.jpeg');
    }
    //-=-=-=-=-=-=-=-=-=-=-=-=
    return res.send(bitmaps.toString('base64'));
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('get-all-user')
  async getAllUser(@Req() request: RequestWithUser, @Res() res) {
    return res.send(await this.userService.GetAllUserFromDB());
  }

  @HttpCode(200)
  @Post('post-public-userdata')
  @UseGuards(JwtAuthGuard)
  async getPublicUserData(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() userId: UserId,
  ) {
    const data = await this.userService.GetAllUserFromDB();
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == userId.id) return res.send(data[i]);
    }
    return res.send({ error: 'user not found' });
  }

  @HttpCode(200)
  @Post('add-chat-list')
  @UseGuards(JwtAuthGuard)
  async addUserChat(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() userId: UserId,
  ) {
    const user = await this.userService.findById(request.user.id);
    let data = [];
    if (user.chat != '') data = await JSON.parse(user.chat);
    if (
      (await this.userService.checkUserIn(userId.id, user.chat)) ||
      (await this.userService.checkUserIn(userId.id, user.friends)) ||
      (await this.userService.checkUserIn(userId.id, user.blocked)) ||
      user.id == userId.id
    )
      return res.send(false);
    const userAdd = await this.userService.findById(userId.id);
    const dataAdd = {
      id: userAdd.id,
      displayname: userAdd.displayname,
      avatar: userAdd.avatar,
    };
    data.push(dataAdd);
    await this.userService.updateChatList(user.id, JSON.stringify(data));
    return res.send(true);
  }

  @HttpCode(200)
  @Post('remove-chat-list')
  @UseGuards(JwtAuthGuard)
  async removeUserChat(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() userId: UserId,
    intern = false,
  ) {
    const user = await this.userService.findById(request.user.id);
    let data = [];
    if (user.chat == '' && !intern) return res.send(false);
    else if (user.chat == '') return false;
    data = JSON.parse(user.chat);
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == userId.id) {
        data.splice(i, 1);
        await this.userService.updateChatList(user.id, JSON.stringify(data));
        if (!intern) return res.send(true);
        else return true;
      }
    }
    if (!intern) return res.send(false);
    return false;
  }

  @HttpCode(200)
  @Post('add-friend-list')
  @UseGuards(JwtAuthGuard)
  async addUserFriend(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() userId: UserId,
  ) {
    const user = await this.userService.findById(request.user.id);
    let data = [];
    if (user.friends != '') data = await JSON.parse(user.friends);
    if (await this.userService.checkUserIn(userId.id, user.chat)) {
      await this.removeUserChat(request, res, userId, true);
    }
    if (
      (await this.userService.checkUserIn(userId.id, user.friends)) ||
      (await this.userService.checkUserIn(userId.id, user.blocked)) ||
      user.id == userId.id
    )
      return res.send(false);
    const userAdd = await this.userService.findById(userId.id);
    const dataAdd = {
      id: userAdd.id,
      displayname: userAdd.displayname,
      avatar: userAdd.avatar,
    };
    data.push(dataAdd);
    await this.userService.updateFriendList(
      user.id,
      await JSON.stringify(data),
    );
    return res.send(true);
  }

  @HttpCode(200)
  @Post('remove-friend-list')
  @UseGuards(JwtAuthGuard)
  async removeUserFriend(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() userId: UserId,
    intern = false,
  ) {
    const user = await this.userService.findById(request.user.id);
    let data = [];
    if (user.friends == '' && !intern) return res.send(false);
    else if (user.friends == '') return false;
    data = await JSON.parse(user.friends);
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == userId.id) {
        const dataChat = {
          id: data[i].id,
          displayname: data[i].displayname,
          avatar: data[i].avatar,
        };
        data.splice(i, 1);
        await this.userService.updateFriendList(user.id, JSON.stringify(data));
        data = [];
        if (user.chat != '') data = await JSON.parse(user.chat);
        data.push(dataChat);
        await this.userService.updateChatList(user.id, JSON.stringify(data));
        if (!intern) return res.send(true);
        return true;
      }
    }
    if (!intern) return res.send(false);
    return false;
  }

  @HttpCode(200)
  @Post('add-block-list')
  @UseGuards(JwtAuthGuard)
  async addUserBlocked(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() userId: UserId,
  ) {
    const user = await this.userService.findById(request.user.id);
    let data = [];
    if (user.blocked != '') data = await JSON.parse(user.blocked);
    if (await this.userService.checkUserIn(userId.id, user.chat)) {
      await this.removeUserChat(request, res, userId, true);
    }
    if (await this.userService.checkUserIn(userId.id, user.friends)) {
      await this.removeUserFriend(request, res, userId, true);
      await this.removeUserChat(request, res, userId, true);
    }
    if (
      (await this.userService.checkUserIn(userId.id, user.blocked)) ||
      user.id == userId.id
    )
      return res.send(false);
    const userAdd = await this.userService.findById(userId.id);
    const dataAdd = {
      id: userAdd.id,
      displayname: userAdd.displayname,
      avatar: userAdd.avatar,
    };
    data.push(dataAdd);
    await this.userService.updateBlockedList(user.id, JSON.stringify(data));
    return res.send(true);
  }

  @HttpCode(200)
  @Post('remove-block-list')
  @UseGuards(JwtAuthGuard)
  async removeUserBlocked(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() userId: UserId,
  ) {
    const user = await this.userService.findById(request.user.id);
    let data = [];
    if (user.blocked == '') return res.send(false);
    data = JSON.parse(user.blocked);
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == userId.id) {
        data.splice(i, 1);
        await this.userService.updateBlockedList(user.id, JSON.stringify(data));
        return res.send(true);
      }
    }
    return res.send(false);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('get-chat-list')
  async getChatList(@Req() request: RequestWithUser, @Res() res) {
    return res.send(await this.userService.getChatList(request.user.id));
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('get-friend-list')
  async getFriendList(@Req() request: RequestWithUser, @Res() res) {
    return res.send(await this.userService.getFriendList(request.user.id));
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('get-block-list')
  async getBlockList(@Req() request: RequestWithUser, @Res() res) {
    return res.send(await this.userService.getBlockList(request.user.id));
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('game-lose')
  async gameLose(@Req() request: RequestWithUser, @Res() res) {
    const user = await this.userService.findById(request.user.id);
    await this.userService.newGameLose(user);
    return res.send(true);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('get-slot')
  async getPlayerSlot(@Req() request: RequestWithUser, @Res() res) {
    return res.send({
      slot: await this.userService.getPlayerSlot(request.user.id),
    });
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('set-game-number/:num')
  async setGameNumber(
    @Req() request: RequestWithUser,
    @Res() res,
    @Param('num') num: number,
  ) {
    const user = await this.userService.findById(request.user.id);
    await this.userService.setNewGameNumber(user, num);
    return res.send(true);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('get-web-socket-id-by-user-id/:id')
  async getWebSocketIdByUserId(@Param('id') id: string, @Res() res) {
    const user = await this.userService.findById(id);
    return res.send(user.idWebSocket);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('new-web-socket/:socketId')
  async newWebSocket(
    @Param('socketId') socketId: string,
    @Req() request: RequestWithUser,
    @Res() res,
  ) {
    const user = await this.userService.findById(request.user.id);
    //console.log(`This is newWebSocket user = ${user.id} and socket = ${socketId}`)
    await this.userService.updateWebSocketId(user.id, socketId);
    return res.send(user.idWebSocket);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('get-block-list')
  async socketId(@Req() request: RequestWithUser, @Res() res) {
    return res.send(await this.userService.getBlockList(request.user.id));
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('id-web-socket')
  async idWebSocket(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() body: socketId,
  ) {
    const user = await this.userService.findById(request.user.id);
    const socketId = body.id; // Get the socket id from the request body
    await this.userService.updateWebSocketId(user.id, socketId); // Pass the socket id to the update function
    return res.send(true);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('id-web-socket')
  async getWebSocketId(@Req() request: RequestWithUser) {
    const user = await this.userService.findById(request.user.id);
    return user.idWebSocket; // Return the socket id for the user
  }

  @Post('block-user')
  @UseGuards(JwtAuthGuard)
  async blockUser(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() muteData: inviteToChannelDto,
  ): Promise<string> {
    return res.send(
      await this.userService.blockUser(request.user.id, muteData),
    );
  }

  @HttpCode(200)
  @Post('unblock-user')
  @UseGuards(JwtAuthGuard)
  async unblockUser(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() muteData: inviteToChannelDto,
  ): Promise<string> {
    return res.send(
      await this.userService.unblockUser(request.user.id, muteData),
    );
  }
  @HttpCode(200)
  @Post('new-message')
  @UseGuards(JwtAuthGuard)
  async handleNewMessage(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() muteData: messageUser,
  ): Promise<string> {
    return res.send(
      await this.userService.newUserMessage(request.user.id, muteData),
    );
  }
  @HttpCode(200)
  @Post('get-msg-hist')
  @UseGuards(JwtAuthGuard)
  async getMsgHistory(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() inviteData: chanIdDto,
  ): Promise<string> {
    return res.send(
      await this.userService.getUserMsgHistory(request.user.id, inviteData.id),
    );
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('game-end')
  async newGameEnd(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() gameInfo: newGameDto,
  ) {
    await this.userService.addNewGame(gameInfo);
    return res.send(true);
  }

  @HttpCode(200)
  @Post('get-match-hist')
  @UseGuards(JwtAuthGuard)
  async getMatchHistory(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() data: chanIdDto,
  ): Promise<any> {
    return res.send(await this.userService.getMatchHistory(data.id));
  }

  @HttpCode(200)
  @Post('get-user-stats')
  @UseGuards(JwtAuthGuard)
  async getUserStats(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() data: chanIdDto,
  ): Promise<any> {
    return res.send(await this.userService.getUserStats(data.id));
  }

  @HttpCode(200)
  @Post('update-game-id')
  @UseGuards(JwtAuthGuard)
  async updateGameId(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() data: chanIdDto,
  ): Promise<any> {
    return res.send(
      await this.userService.updateGameID(request.user.id, data.id),
    );
  }

  @HttpCode(200)
  @Post('update-slot-nu')
  @UseGuards(JwtAuthGuard)
  async updateSlotId(
    @Req() request: RequestWithUser,
    @Res() res,
    @Body() data: idNumberDto,
  ): Promise<any> {
    return res.send(
      await this.userService.updateSlotID(request.user.id, data.id),
    );
  }

  @HttpCode(200)
  @Get('get-slot-nu')
  @UseGuards(JwtAuthGuard)
  async getSlotNu(
    @Req() request: RequestWithUser,
    @Res() res,
  ): Promise<number> {
    return res.send(await this.userService.getSlotID(request.user.id));
  }

  @HttpCode(200)
  @Get('in-game')
  @UseGuards(JwtAuthGuard)
  async setInGame(
    @Req() request: RequestWithUser,
    @Res() res,
  ): Promise<boolean> {
    return res.send(await this.userService.inGame(request.user.id));
  }

  @HttpCode(200)
  @Get('not-in-game')
  @UseGuards(JwtAuthGuard)
  async setNotInGame(
    @Req() request: RequestWithUser,
    @Res() res,
  ): Promise<boolean> {
    return res.send(await this.userService.notInGame(request.user.id));
  }
}
