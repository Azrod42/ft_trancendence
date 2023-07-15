import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';


@WebSocketGateway(4001, { cors: { origin: ['http://localhost:3000'] } })
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  connectedUser: any[];
    onModuleInit(): any {
        this.server.setMaxListeners(2000);
        this.server.on('connection', (socket) => {
            console.log(`a user connected = ${socket.id}`);

            socket.on('storeClientInfo', function (data) {
                // Ici, vous pouvez stocker `data.userId` et `data.socketId` dans votre base de données
                console.log('Received ID:', data.socketId, 'for user:', data.userId);
            });

            // if (waitingPlayer) {
            //   // Il y a un joueur en attente, alors les mettre ensemble dans une salle
            //   const room = `room-${waitingPlayer.id}-${socket.id}`;
            //   socket.join(room);
            //   waitingPlayer.join(room);

            //   // Vous pouvez maintenant utiliser `io.to(room).emit()` pour envoyer des messages à ces deux joueurs

            //   console.log(`Users ${waitingPlayer.id} and ${socket.id} are paired together.`);
            //   waitingPlayer = null; // Réinitialisez le joueur en attente
            // } else {
            //   // Aucun joueur n'attend, alors mettez ce joueur en attente
            //   waitingPlayer = socket;
            // }

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
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
}
