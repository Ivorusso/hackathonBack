import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [ChatModule, GeminiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
