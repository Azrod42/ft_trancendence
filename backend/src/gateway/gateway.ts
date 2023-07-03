import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import  { Server } from 'socket.io'
import {OnModuleInit} from "@nestjs/common";
@WebSocketGateway(4001, {cors: { origin: ['http://localhost:3000']}})
export class MyGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;


    onModuleInit(): any {
        this.server.on('connection', (socket) => {
            console.log(socket.id, '\nConnected');
        })
    }
    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        this.server.emit('onMessage', {
            msg: 'New message',
            content: body,
        })
    }
}