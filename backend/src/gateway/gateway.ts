import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {OnModuleInit} from "@nestjs/common";
import  { Server, Socket } from 'socket.io'
import express from "express";


@WebSocketGateway(4001, {cors: { origin: ['http://localhost:3000']}})
export class MyGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;

    sockets: { [id: string]: Socket } = {};
    connectedUser: any[];

    onModuleInit(): any {
        this.server.setMaxListeners(2000);
        this.server.on('connection', (socket) => {
            console.log(`a user connected as = ${socket.id}`);
            this.sockets[socket.id] = socket;

            socket.on('storeClientInfo', function (data) {
                // Ici, vous pouvez stocker `data.userId` et `data.socketId` dans votre base de données
                console.log('Received ID:', data.socketId, 'for user:', data.userId);
            });

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
                delete this.sockets[socket.id];
            });
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
    @SubscribeMessage('pong')
    onPongHandle(@MessageBody() body: any) {
        const actual = this.connectedUser;
        for (let i  = 0; actual[i]; i++) {
            if (actual[i].id == body?.user.id) {
                return;
            }
        }
        this.connectedUser.push(body?.user);
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

    @SubscribeMessage('duel')
    onDuelRequest(@MessageBody() body: {recipient: string, socket: string}) {
        console.log("Received 'duel' event with body:", body);
    
        const recipientSocketId = body.socket;
        console.log(`Recipient socketId = ${recipientSocketId}`);
        const recipientSocket = this.sockets[recipientSocketId];
    
        if(recipientSocket) {
            console.log(`Recipient socket was found = ${body.socket}`);
            recipientSocket.emit('duelRequest', {
                msg: 'New duel request',
            });
            console.log("'duelRequest' event has been emitted");
        }
        else {
            console.log(`Recipient socket not found = ${body.recipient}`);
        }
    }

    @SubscribeMessage('duelRequest')
    onDuelRequestAccepted(@MessageBody() body: {msg: string}) {
    console.log("We are in 'duelRequest' event with bodyyy:", body);

    const message = body.msg;
    console.log(`Message = ${message}`);

}
    
}

