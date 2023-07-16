import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {OnModuleInit} from "@nestjs/common";
import  { Server, Socket } from 'socket.io'
import { UserService } from '../user/user.service';


@WebSocketGateway(4042, { cors: { origin: ['http://localhost:3000'] } })
export class MyGateway2 implements OnModuleInit {
    @WebSocketServer()
    server: Server;

    ready: any[] = [];
    onModuleInit(): any {
        console.log('IIIIIIINNNNNNIIIIIIIITTTTT');
        this.server.setMaxListeners(9999);
        this.server.on('connection', (socket) => {
            console.log(`NEW USER = ${socket.id}`);

            socket.on('disconnect', () => {
                console.log(`NEW USER: ${socket.id}`);
            });
        })
    }

    @SubscribeMessage('room-data')
    onRoomData(@MessageBody() body: {id: string, data: any}) {
        if (body.data?.status == 'ready'){
            console.log(this.ready);
            for (let i = 0; this.ready[i]; i++) {
                if (this.ready[i].id == body.id) {
                    if (this.ready[i].idReady != body.data.ready) {
                        // for(let j = 0; this.ready[j]; j++){
                        //     if (this.ready[j].id == body.id) {
                        //         this.ready[j].id = 'END';
                        //         this.ready[j].idReady = 'END';
                        //         this.ready.clear();
                        //     }
                        // }
                        this.ready = [];
                        this.server.emit('global', {id: body.id, status: 'game', game: true});
                        return;
                    }
                }
            }
            this.ready.push({id: body.id, idReady: body.data?.ready});
        } else {
            this.server.emit('global', {id: body.id, data: body.data});
        }
    }

}
