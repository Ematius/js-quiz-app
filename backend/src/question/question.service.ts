import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Question } from './entities/question.entity';
import { AnswerInviteDto, AnswerQuestionDto } from './dto/answer.question.dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  create() {
    throw new NotImplementedException('Create method is not implemented.');
  }

  async findAll(): Promise<Question[]> {
    return await this.prisma.question.findMany();
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.prisma.question.findUnique({ where: { id } });

    if (!question) {
      throw new NotFoundException(`Pregunta con id ${id} no encontrada`);
    }
    return question;
  }

  update() {
    throw new NotImplementedException('Update method is not implemented.');
  }

  remove() {
    throw new NotImplementedException('Remove method is not implemented.');
  }
  //-----------------------------------------------------------------------------------

  async getOneQuestion(lastId?: number): Promise<Question> {
    const next = await this.prisma.question.findFirst({
      where: { id: lastId },
      orderBy: { id: 'asc' },
    });
    if (!next) throw new NotFoundException('No hay más preguntas');
    return next;
  }

  
  async answerInvite(dto: AnswerInviteDto) {
    const question = await this.prisma.question.findUnique({
      where: { id: dto.questionId },
    });

    if (!question) {
      throw new NotFoundException(
        `Pregunta con id ${dto.questionId} no encontrada`,
      );
    }

    const isCorrect = question.answer === dto.answer;

    return {
      isCorrect,
      correctAnswer: question.answer,
    };
  }

  async registerProgress(dto: AnswerQuestionDto) {
    const question = await this.prisma.question.findUnique({
      where: { id: dto.questionId },
    });
    if (!question) {
      throw new NotFoundException(
        `Pregunta con id ${dto.questionId} no encontrada`,
      );
    }
    const isCorrect = question.answer === dto.answer;

    if (dto.userId) {
      await this.prisma.user_progress.upsert({
        where: {
          user_id_question_id: {
            user_id: dto.userId,
            question_id: dto.questionId,
          },
        },
        update: { is_correct: isCorrect },
        create: {
          user_id: dto.userId,
          question_id: dto.questionId,
          is_correct: isCorrect,
        },
      });
    }
    const [correct, total] = dto.userId
      ? await Promise.all([
          this.prisma.user_progress.count({
            where: { user_id: dto.userId, is_correct: true },
          }),
          this.prisma.question.count(),
        ])
      : [0, await this.prisma.question.count()];

    return {
      isCorrect,
      questionId: dto.questionId,
      correctAnswer: question.answer,
      progress: { correct, total },
    };
  }


  async toggleFavorite(userId: number, questionId: number) {
    const where = {
      user_id_question_id: { user_id: userId, question_id: questionId },
    };
    const exist = await this.prisma.favorite.findUnique({ where });

    if (exist) {
      await this.prisma.favorite.delete({ where });
      return { favorite: false, message: 'Eliminada de favoritos' };
    }
    try {
      await this.prisma.favorite.create({
        data: { user_id: userId, question_id: questionId },
      });
      return { favorite: true, message: 'Añadida a favoritos' };
    } catch (e: any) {
      if (e?.code === 'P2002')
        return { favorite: true, message: 'Añadida a favoritos' };
      throw e;
    }
  }

  async getFavorites(
    userId: number,
  ): Promise<
    Pick<Question, 'id' | 'question' | 'answer' | 'method' | 'level'>[]
  > {
    const favorites = await this.prisma.favorite.findMany({
      where: { user_id: userId },
      include: {
        question: {
          select: {
            id: true,
            question: true,
            answer: true,
            method: true,
            level: true,
          },
        },
      },
      orderBy: { question_id: 'asc' },
    });

    return favorites.map((f) => f.question);
  }
}
