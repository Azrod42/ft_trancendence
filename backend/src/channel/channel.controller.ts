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
import {chanJoinDto} from "./dtos/channel.dto";

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
}
