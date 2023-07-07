import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {OnModuleInit} from "@nestjs/common";
import  { Server } from 'socket.io'
import express from "express";

// const app = express();
//
//
// app.use(express.json()); // Ajoutez ceci pour que Express puisse analyser le JSON dans le corps des requêtes
//
// app.post('/users/id-web-socket', (req, res) => {
//     const userId = req.body.userId; // Remplacez ceci par la logique d'authentification pour obtenir l'ID de l'utilisateur
//     const socketId = req.body.socketId;
//
//     console.log(`Received socket ID ${socketId} for user ${userId}`);
//
//     // Ici, vous pouvez stocker `userId` et `socketId` dans votre base de données
//
//     res.send({ success: true }); // Renvoyer une réponse pour que le client sache que la requête a réussi
// });

@WebSocketGateway(4001, {cors: { origin: ['http://localhost:3000']}})
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