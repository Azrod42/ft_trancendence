import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {OnModuleInit} from "@nestjs/common";
import  { Server, Socket } from 'socket.io'
import { UserService } from '../user/user.service';
import {v4 as uuidv4} from 'uuid';



@WebSocketGateway(4042, { cors: { origin: ['http://localhost:3000']}})
export class MyGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;
    constructor(private readonly userService: UserService) {}

    sockets: { [id: string]: Socket } = {};
    connectedUser: any[];
    ready: any[] = [];
    ranked: any[] = [];
    waitingPlayer = '';
    waitingPlayerU = '';
    games: any[] = [];

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
        setInterval(() => {
            this.waitingPlayer = '';
        }, 10000)
    }

    @SubscribeMessage('room')
    onCreateRoom(@MessageBody() body: string) {
        // console.log("Channel created on", body);
        this.server.socketsJoin(body);
    }
    @SubscribeMessage('mmR')
    onMMR(@MessageBody() body: {id: string, status: string,  data: any}) {
        // console.log(body.id, this.waitingPlayer)
        if (this.waitingPlayer != '' && this.waitingPlayer != body.id) {
            const player2 = this.waitingPlayer;
            const room = uuidv4();
            this.waitingPlayer = '';
            this.games.push({idRoom : 'R' + room, p1ID: body.id, p2ID: player2});
            this.server.emit('lunch', {player1: body.id, player2: player2, roomID: room});
        } else {
            this.waitingPlayer = body.id;
        }
    }

    @SubscribeMessage('mmU')
    onMMU(@MessageBody() body: {id: string, status: string,  data: any}) {
        // console.log(body.id, this.waitingPlayerU)
        if (this.waitingPlayerU != '' && this.waitingPlayerU != body.id) {
            const player2 = this.waitingPlayerU;
            const room = uuidv4();
            this.waitingPlayerU = '';
            this.games.push({idRoom : 'U' + room, p1ID: body.id, p2ID: player2});
            this.server.emit('lunchU', {player1: body.id, player2: player2, roomID: room});
        } else {
            this.waitingPlayerU = body.id;
        }
    }
    @SubscribeMessage('room-data')
    onRoomData(@MessageBody() body: {id: string, status: string,  data: any}) {
        if (body?.status == 'ready'){
            this.server.emit('global', {roomID: body.id, status: 'ready'});
            for (let i = 0; this.ready[i]; i++) {
                if (this.ready[i].id == body.id) {
                    // console.log(this.ready);
                    if (this.ready[i].idReady != body.data.ready) {
                        this.server.emit('global', {roomID: body.id, status: 'game', game: true});
                        return;
                    }
                }
            }
            this.ready.push({id: body.id, data: body.data});
        } else if (body?.status == 'ranked'){
            this.ready = [];
            for(let i = 0; this.ranked[i]; i++) {
                if (this.ranked[i].id = body.id){
                    this.ranked[i].ranked = body.data;
                    this.server.emit('global', {roomID: body.id, status: 'ranked', ranked: body.data});
                    return;
                }
            }
            this.ranked.push({id: body.id, ranked: body.data});
            this.server.emit('global', {roomID: body.id, status: 'ranked', ranked: body.data});
        } else if (body?.status == 'room-users'){
            for(let i = 0; this.games[i]; i++) {
                if (this.games[i].idRoom == body.id) {
                    this.server.emit('global', {roomID: body.id, status: 'game-users', p1: this.games[i].p1ID, p2: this.games[i].p2ID, p1S: body.data.p1S, p2S: body.data.p2S, ranked: body.data.ranked});
                }
            }
        } else {
            // console.log(body)
            this.server.emit('global', {roomID: body.id, data: body.data});
        }
    }
    @SubscribeMessage('gameRoom')
    onCreateGameRoom(@MessageBody() body: string) {
        // console.log("Channel created on", body);
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
    onDuelRequest(@MessageBody() data: { socketId: string, idRoom: string, p2ID: string, p1ID: string}) {
        this.games.push({idRoom : data.idRoom, p1ID: data.p1ID, p2ID: data.p2ID});
        this.server.sockets.to(data.socketId).emit('duelRequest', data);
    }

    @SubscribeMessage('acceptDuel')
    onAcceptDuel(@MessageBody() data: { socketId: string, idRoom: string, currentUserId: string, currentUserName: string}) {
        this.server.in(data.idRoom).emit('acceptDuel', data);
    }

    @SubscribeMessage('move')
    onMove(@MessageBody() data: { idRoom: string, user:string, y: string}) {
        this.server.in(data.idRoom).emit(data.idRoom, data);
    }
}
