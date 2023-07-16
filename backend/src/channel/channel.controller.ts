import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import {ChannelService} from "./channel.service";
import JwtAuthGuard from "../auth/jwtAuth.guard";
import RequestWithUser from "../auth/interface/requestWithUser.i";
import CreateChannelDto from "./dtos/channel.create.dto";
import {
    chanIdDto,
    chanJoinDto,
    chanNewTypeDto,
    inviteToChannelDto,
    messageReqDto,
    muteUserDto
} from "./dtos/channel.dto";

@Controller('channel')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @HttpCode(200)
    @Post('register-channel')
    @UseGuards(JwtAuthGuard)
    async registerChannel (@Req() request: RequestWithUser, @Res() res, @Body() channelData: CreateChannelDto) {
        return res.send(await this.channelService.createChannel(channelData));
    }
    @HttpCode(200)
    @Get('user-channel')
    @UseGuards(JwtAuthGuard)
    async  userChannel (@Req() request: RequestWithUser, @Res() res): Promise<string> {
        return res.send(await this.channelService.getUserChannel(request.user.id));
    }
    @HttpCode(200)
    @Get('channel-without-user')
    @UseGuards(JwtAuthGuard)
    async  channelWithoutUser (@Req() request: RequestWithUser, @Res() res): Promise<string> {
        return res.send(await this.channelService.getChannelWithoutUser(request.user.id));
    }
    @HttpCode(200)
    @Post('user-join-channel')
    @UseGuards(JwtAuthGuard)
    async  userJoinChannel (@Req() request: RequestWithUser, @Res() res, @Body() channelInfo: chanJoinDto): Promise<string> {
        return res.send(await this.channelService.userJoinChannel(request.user.id, channelInfo.id, channelInfo.password));
    }
    @HttpCode(200)
    @Post('fetch-channel-info')
    @UseGuards(JwtAuthGuard)
    async fetchChannelInfo (@Req() request: RequestWithUser, @Res() res, @Body() channelInfo: chanIdDto): Promise<string> {
        return res.send( await this.channelService.findChannelById(channelInfo.id, request.user.id));
    }

    @HttpCode(200)
    @Post('channel-new-type')
    @UseGuards(JwtAuthGuard)
    async channelNewType (@Req() request: RequestWithUser, @Res() res, @Body() channelInfo: chanNewTypeDto): Promise<string> {
        return res.send( await this.channelService.changeChannelType(channelInfo, request.user.id));
    }
    @HttpCode(200)
    @Post('invite-user-channel')
    @UseGuards(JwtAuthGuard)
    async  inviteUserChannel (@Req() request: RequestWithUser, @Res() res, @Body() inviteData: inviteToChannelDto): Promise<string> {
        return res.send(await this.channelService.inviteUserChannel(request.user.id, inviteData.id, inviteData.chanId));
    }
    @HttpCode(200)
    @Post('kick-user')
    @UseGuards(JwtAuthGuard)
    async  kickUserChannel (@Req() request: RequestWithUser, @Res() res, @Body() inviteData: inviteToChannelDto): Promise<string> {
        return res.send(await this.channelService.kickUserChannel(request.user.id, inviteData.id, inviteData.chanId));
    }
    @HttpCode(200)
    @Post('ban-user')
    @UseGuards(JwtAuthGuard)
    async  banUserChannel (@Req() request: RequestWithUser, @Res() res, @Body() inviteData: inviteToChannelDto): Promise<string> {
        return res.send(await this.channelService.banUserChannel(request.user.id, inviteData.id, inviteData.chanId));
    }
    @HttpCode(200)
    @Post('unban-user')
    @UseGuards(JwtAuthGuard)
    async  unbanUserChannel (@Req() request: RequestWithUser, @Res() res, @Body() inviteData: inviteToChannelDto): Promise<string> {
        return res.send(await this.channelService.unbanUserChannel(request.user.id, inviteData.id, inviteData.chanId));
    }
    @HttpCode(200)
    @Post('leave-channel')
    @UseGuards(JwtAuthGuard)
    async leaveChannel (@Req() request: RequestWithUser, @Res() res, @Body() chanData: chanIdDto): Promise<string> {
        return res.send(await this.channelService.leaveChannel(request.user.id, chanData.id));
    }
    @HttpCode(200)
    @Post('add-administrator')
    @UseGuards(JwtAuthGuard)
    async  addAdministrator (@Req() request: RequestWithUser, @Res() res, @Body() inviteData: inviteToChannelDto): Promise<string> {
        return res.send(await this.channelService.addAdministrator(request.user.id, inviteData.id, inviteData.chanId));
    }
    @HttpCode(200)
    @Post('remove-administrator')
    @UseGuards(JwtAuthGuard)
    async  removeAdministrator (@Req() request: RequestWithUser, @Res() res, @Body() inviteData: inviteToChannelDto): Promise<string> {
        return res.send(await this.channelService.removeAdministrator(request.user.id, inviteData.id, inviteData.chanId));
    }
    @HttpCode(200)
    @Post('mute-user')
    @UseGuards(JwtAuthGuard)
    async  muteUser (@Req() request: RequestWithUser, @Res() res, @Body() muteData: muteUserDto): Promise<string> {
        return res.send(await this.channelService.muteUser(request.user.id, muteData));
    }
    @HttpCode(200)
    @Post('new-message')
    @UseGuards(JwtAuthGuard)
    async  handleNewMessage (@Req() request: RequestWithUser, @Res() res, @Body() muteData: messageReqDto): Promise<string> {
        return res.send(await this.channelService.newMessage(request.user.displayname, muteData));
    }
    @HttpCode(200)
    @Post('get-msg-hist')
    @UseGuards(JwtAuthGuard)
    async  getMsgHistory (@Req() request: RequestWithUser, @Res() res, @Body() inviteData: inviteToChannelDto): Promise<string> {
        return res.send(await this.channelService.getMsgHistory(request.user.id, inviteData.id, inviteData.chanId));
    }


}
