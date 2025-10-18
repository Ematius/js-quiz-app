import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Question } from './entities/question.entity';
import { AnswerInviteDto, AnswerQuestionDto } from './dto/answer.question.dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  create() {
    throw new NotImplementedException('Create method is not implemented.');
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

  async PostToggleFavorite(userId: number, questionId: number) {
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
  async checkFavoriteInUser(
    userId: number,
    questionId: number,
  ): Promise<boolean> {
    const row = await this.prisma.favorite.findUnique({
      where: {
        user_id_question_id: { user_id: userId, question_id: questionId },
      },
      select: { user_id: true },
    });
    return !!row;
  }

  async updateProgress(userId: number, dto: AnswerQuestionDto) {
    const question = await this.prisma.question.findUnique({
      where: { id: dto.questionId },
      select: { answer: true },
    });
    if (!question) throw new NotFoundException('Pregunta no encontrada');

   
    const isCorrect = dto.answer.trim() === question.answer.trim();

    await this.prisma.user_progress.upsert({
      where: {
        user_id_question_id: {
          user_id: userId,
          question_id: dto.questionId,
        },
      },
      update: { is_correct: isCorrect },
      create: {
        user_id: userId,
        question_id: dto.questionId,
        is_correct: isCorrect,
      },
    });
    return { isCorrect, questionId: dto.questionId, correctAnswer: question.answer };
  }

  async readProgress(userId: number) {
    const questionCorrect = this.prisma.user_progress.count({
      where: { user_id: userId, is_correct: true },
    });
    const questionAnswered = this.prisma.user_progress.count({
      where: { user_id: userId },
    });
    const questionsTotal = this.prisma.question.count();

    const [correct, answered, total] = await this.prisma.$transaction([
      questionCorrect,
      questionAnswered,
      questionsTotal,
    ]);
    const wrong = Math.max(answered - correct, 0);
    const unanswered = Math.max(total - answered, 0);

    return { answered, unanswered, correct, wrong, total };
  }
}
