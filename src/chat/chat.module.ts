import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  providers: [ChatGateway],
})
export class ChatModule {}
