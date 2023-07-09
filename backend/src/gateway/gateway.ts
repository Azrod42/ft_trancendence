import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {OnModuleInit} from "@nestjs/common";
import  { Server } from 'socket.io'

@WebSocketGateway(4001, {cors: { origin: ['http://localhost:3000']}})
export class MyGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;

    connectedUser: any[];

    onModuleInit(): any {
        this.server.setMaxListeners(2000);
        this.server.on('connection', (socket) => {
            // console.log(socket.id, '\nConnected');

        })
        setInterval(() => {
            this.connectedUser = [];
            this.server.emit('ping', {
                data: 'ping'
            })
            }, 5000)
        setInterval(() => {
            this.server.emit('connectedUser', {
                data: this.connectedUser,
            })
        }, 6000)
    }

    @SubscribeMessage('room')
    onCreateRoom(@MessageBody() body: string) {
        this.server.socketsJoin(body);
    }

    @SubscribeMessage('gameRoom')
    onCreateGameRoom(@MessageBody() body: string) {
        this.server.socketsJoin(body);
        this.server.in(body).emit(body, {message: 'A nerd join gameRoom'});
    }
    @SubscribeMessage('pong')
    onPongHandle(@MessageBody() body: any) {
        this.connectedUser.push(body?.user!);
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        this.server.emit('onMessage', {
            msg: 'New message',
            content: body?.message,
        })
    }
    @SubscribeMessage('channelMessage')
    async onChannelMessage(@MessageBody() body: {channel: string, message: string}) {
        this.server.in(body.channel).emit(body.channel, {
            msg: 'New message',
            content: body?.message
        })
    }
}