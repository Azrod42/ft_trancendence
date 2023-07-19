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
        this.server.setMaxListeners(2000);
        this.server.on('connection', (socket) => {
            // console.log(`a user connected as = ${socket.id}`);
        this.sockets[socket.id] = socket;

            socket.on('storeClientInfo', async function (data) {
            // console.log(' We are in storeClientInfo, Received ID:', data.socketId, 'for user:', data.userId.user.id);
            this.server.sockets.to(data.socketId).emit('newSocket', data);
            //this.userService.updateWebSocketId(data.userId.user.id, data.socketId);  
            });

            socket.on('disconnect', () => {
                // console.log(`User disconnected: ${socket.id}`);
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
        console.log("Channel created on", body);
        this.server.socketsJoin(body);
    }

    @SubscribeMessage('room-data')
    onRoomData(@MessageBody() body: {id: string, data: any}) {
        if (body.data?.status == 'ready'){
            console.log('ready');
            for (let i = 0; this.ready[i]; i++) {
                if (this.ready[i].id == body.id) {
                    if (this.ready[i].idReady != body.data.ready) {
                        // for(let j = 0; this.ready[j]; j++){
                        //     if (this.ready[j].id == body.id) {
                        //         this.ready[j].id = 'END';
                        //         this.ready[j].idReady = 'END';
                        //         this.ready.clear();
                        this.ready = [];
                        this.server.in(body.id).emit(body.id, {status: 'game', game: true});
                        return;
                    }
                }
            }
            this.ready.push({id: body.id, data: body.data});
        } else {
            this.server.in(body.id).emit(body.id, {data: body.data});
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
