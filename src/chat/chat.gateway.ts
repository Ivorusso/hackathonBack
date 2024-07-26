import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { GeminiService } from '../gemini/gemini.service';
import { ChatMessage } from './chat.interface';

@WebSocketGateway({
  cors: {
    origin: '*', 
    methods: ["GET", "POST"],
    credentials: true
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly geminiService: GeminiService) {}

  @SubscribeMessage('messageToServer')
  async handleMessage(client: Socket, payload: ChatMessage): Promise<void> {
    try {
      this.logger.log(`Received message from client ${client.id}: ${JSON.stringify(payload)}`);

      if (!payload || !payload.data) {
        throw new Error('Invalid payload');
      }
      
      const response = await this.geminiService.analyzeMessage(payload.data);

      client.emit('messageFromServer', response);
    } catch (error) {
      this.logger.error(`Error handling message from client ${client.id}: ${error.message}`, error.stack);
      client.emit('error', 'An error occurred while processing your message');
    }
  }

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('connection', 'Connection established');
  }
}
