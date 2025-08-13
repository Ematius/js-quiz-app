import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';
import { Question } from './question/entities/question.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    QuestionModule,
    UserModule,
    AuthModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
