import { Injectable, OnModuleInit } from '@nestjs/common';
import WebSocket from 'ws';

@Injectable()
export class SocketClient {

  ws = new WebSocket('ws://localhost:4042', {
    perMessageDeflate: false
  });

}
