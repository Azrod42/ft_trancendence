import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {OnModuleInit} from "@nestjs/common";
import  { Server, Socket } from 'socket.io'
import { UserService } from '../user/user.service';


@WebSocketGateway(4042, { cors: { origin: ['http://localhost:3000']}})
export class MyGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;
    constructor(private readonly userService: UserService) {}

    sockets: { [id: string]: Socket } = {};
    connectedUser: any[];
    ready: any[] = [];
    onModuleInit(): any {
        this.server.on('connection', (socket) => {
            // console.log(`a user connected as = ${socket.id}`);
            this.sockets[socket.id] = socket;
            socket.on('storeClientInfo', async function (data) {
                this.server.sockets.to(data.socketId).emit('newSocket', data);
            });

            socket.on('disconnect', () => {
                // console.log(`User disconnected: ${socket.id}`);
                delete this.sockets[socket.id];
            });
        });

        setInterval(() => {
            this.connectedUser = [];
            this.server.emit('ping', {
                data: 'ping'
            })
            }, 1000)
        setInterval(() => {
            this.server.emit('connectedUser', {
                data: this.connectedUser,
            })
        }, 1400)
    }

    @SubscribeMessage('room')
    onCreateRoom(@MessageBody() body: string) {
        console.log("Channel created on", body);
        this.server.socketsJoin(body);
    }

    @SubscribeMessage('room-data')
    onRoomData(@MessageBody() body: {id: string, status: string,  data: any}) {
        if (body?.status == 'ready'){
            this.server.emit('global', {roomID: body.id, status: 'ready'});
            console.log('ready');
            for (let i = 0; this.ready[i]; i++) {
                if (this.ready[i].id == body.id) {
                    console.log(this.ready);
                    if (this.ready[i].idReady != body.data.ready) {
                        this.server.emit('global', {roomID: body.id, status: 'game', game: true});
                        return;
                    }
                }
            }
            this.ready.push({id: body.id, data: body.data});
        } else {
            this.server.emit('global', {roomID: body.id, data: body.data});
        }
    }
    @SubscribeMessage('gameRoom')
    onCreateGameRoom(@MessageBody() body: string) {
        console.log("Channel created on", body);
        this.server.socketsJoin(body);
        this.server.in(body).emit(body, {message: 'A nerd join gameRoom'});
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
    @SubscribeMessage('duelRequest')
    onDuelRequest(@MessageBody() data: { socketId: string, idRoom: string }) {
    // console.log(`We are in 'duelRequest' event and this is socketId = ${data.socketId}`, "ID room", data?.idRoom);
    // console.log('yes -0-0-0-0-0-0- ', data.idRoom);
    this.server.sockets.to(data.socketId).emit('duelRequest', data);
    }

    @SubscribeMessage('acceptDuel')
    onAcceptDuel(@MessageBody() data: { socketId: string, idRoom: string, currentUserId: string, currentUserName: string}) {
        // console.log('On etait dans le back end de acceptDuel ', data.idRoom);
        this.server.in(data.idRoom).emit('acceptDuel', data);
    }

    @SubscribeMessage('move')
    onMove(@MessageBody() data: { idRoom: string, user:string, y: string}) {
        // console.log('On etait dans le back end de move ', data.idRoom);
        this.server.in(data.idRoom).emit(data.idRoom, data);
    }
}
