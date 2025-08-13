import { Module } from '@nestjs/common';
import{ TypeOrmModule } from '@nestjs/typeorm';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Question } from './entities/question.entity';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
