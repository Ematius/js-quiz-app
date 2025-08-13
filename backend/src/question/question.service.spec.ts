import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('QuestionService', () => {
  let service: QuestionService;

  const prismaMock = {
    question: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
    user_progress: {
      upsert: jest.fn(),
      count: jest.fn(),
    },
    favorite: {
      findUnique: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  } as unknown as PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('devuelve todas las preguntas', async () => {
      const list = [{ id: 1 }, { id: 2 }] as any;
      (prismaMock.question.findMany as jest.Mock).mockResolvedValueOnce(list);

      const res = await service.findAll();

      expect(prismaMock.question.findMany).toHaveBeenCalledWith();
      expect(res).toEqual(list);
    });
  });

  describe('findOne', () => {
    it('devuelve una pregunta existente', async () => {
      const q = { id: 10 } as any;
      (prismaMock.question.findUnique as jest.Mock).mockResolvedValueOnce(q);

      const res = await service.findOne(10);

      expect(prismaMock.question.findUnique).toHaveBeenCalledWith({
        where: { id: 10 },
      });
      expect(res).toBe(q);
    });

    it('lanza NotFound si no existe', async () => {
      (prismaMock.question.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('getNextQuestion', () => {
    it('sin lastId: devuelve la primera', async () => {
      const first = { id: 1 } as any;
      (prismaMock.question.findFirst as jest.Mock).mockResolvedValueOnce(first);

      const res = await service.getNextQuestion();

      expect(prismaMock.question.findFirst).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      });
      expect(res).toBe(first);
    });

    it('sin lastId: NotFound si no hay preguntas', async () => {
      (prismaMock.question.findFirst as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.getNextQuestion()).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('con lastId: devuelve la siguiente', async () => {
      const next = { id: 5 } as any;
      (prismaMock.question.findFirst as jest.Mock).mockResolvedValueOnce(next);

      const res = await service.getNextQuestion(3);

      expect(prismaMock.question.findFirst).toHaveBeenCalledWith({
        where: { id: { gt: 3 } },
        orderBy: { id: 'asc' },
      });
      expect(res).toBe(next);
    });

    it('con lastId: NotFound si no hay más', async () => {
      (prismaMock.question.findFirst as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.getNextQuestion(100)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('registerProgress', () => {
    const baseQuestion = { id: 7, answer: '42' } as any;

    it('con userId: guarda progreso (correcto) y devuelve conteo', async () => {
      (prismaMock.question.findUnique as jest.Mock).mockResolvedValueOnce(
        baseQuestion,
      );
      (prismaMock.user_progress.upsert as jest.Mock).mockResolvedValueOnce({});
      (prismaMock.user_progress.count as jest.Mock).mockResolvedValueOnce(5);
      (prismaMock.question.count as jest.Mock).mockResolvedValueOnce(10);

      const dto = { userId: 1, questionId: 7, answer: '42' };
      const res = await service.registerProgress(dto as any);

      expect(prismaMock.user_progress.upsert).toHaveBeenCalledWith({
        where: { user_id_question_id: { user_id: 1, question_id: 7 } },
        update: { is_correct: true },
        create: { user_id: 1, question_id: 7, is_correct: true },
      });
      expect(res).toEqual({
        isCorrect: true,
        questionId: 7,
        correctAnswer: '42',
        progress: { correct: 5, total: 10 },
      });
    });

    it('sin userId: no guarda progreso y total viene de count', async () => {
      (prismaMock.question.findUnique as jest.Mock).mockResolvedValueOnce(
        baseQuestion,
      );
      (prismaMock.question.count as jest.Mock).mockResolvedValueOnce(10);

      const dto = { questionId: 7, answer: '0' }; // incorrecta
      const res = await service.registerProgress(dto as any);

      expect(prismaMock.user_progress.upsert).not.toHaveBeenCalled();
      expect(res).toEqual({
        isCorrect: false,
        questionId: 7,
        correctAnswer: '42',
        progress: { correct: 0, total: 10 },
      });
    });

    it('NotFound si la pregunta no existe', async () => {
      (prismaMock.question.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const dto = { userId: 1, questionId: 999, answer: 'x' };
      await expect(service.registerProgress(dto as any)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('answerInvite', () => {
    it('devuelve isCorrect y correctAnswer', async () => {
      (prismaMock.question.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 3,
        answer: 'A',
      });

      const res = await service.answerInvite({
        questionId: 3,
        answer: 'B',
      } as any);

      expect(res).toEqual({ isCorrect: false, correctAnswer: 'A' });
    });

    it('NotFound si no existe la pregunta', async () => {
      (prismaMock.question.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        service.answerInvite({ questionId: 1, answer: 'X' } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('toggleFavorite', () => {
    const where = { user_id_question_id: { user_id: 1, question_id: 10 } };

    it('si existe: elimina y devuelve favorite=false', async () => {
      (prismaMock.favorite.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 1,
      });
      (prismaMock.favorite.delete as jest.Mock).mockResolvedValueOnce({});

      const res = await service.toggleFavorite(1, 10);

      expect(prismaMock.favorite.delete).toHaveBeenCalledWith({ where });
      expect(res).toEqual({
        favorite: false,
        message: 'Eliminada de favoritos',
      });
    });

    it('si no existe: crea y devuelve favorite=true', async () => {
      (prismaMock.favorite.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (prismaMock.favorite.create as jest.Mock).mockResolvedValueOnce({
        id: 2,
      });

      const res = await service.toggleFavorite(1, 10);

      expect(prismaMock.favorite.create).toHaveBeenCalledWith({
        data: { user_id: 1, question_id: 10 },
      });
      expect(res).toEqual({ favorite: true, message: 'Añadida a favoritos' });
    });

    it('si create lanza P2002: también devuelve favorite=true', async () => {
      (prismaMock.favorite.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (prismaMock.favorite.create as jest.Mock).mockRejectedValueOnce({
        code: 'P2002',
      });

      const res = await service.toggleFavorite(1, 10);

      expect(res).toEqual({ favorite: true, message: 'Añadida a favoritos' });
    });
  });

  describe('getFavorites', () => {
    it('mapea y devuelve la lista de preguntas favoritas', async () => {
      (prismaMock.favorite.findMany as jest.Mock).mockResolvedValueOnce([
        {
          question: {
            id: 1,
            question: 'Q1',
            answer: 'A1',
            method: 'map',
            level: 1,
          },
        },
        {
          question: {
            id: 2,
            question: 'Q2',
            answer: 'A2',
            method: 'filter',
            level: 2,
          },
        },
      ]);

      const res = await service.getFavorites(7);

      expect(prismaMock.favorite.findMany).toHaveBeenCalledWith({
        where: { user_id: 7 },
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
      expect(res).toEqual([
        { id: 1, question: 'Q1', answer: 'A1', method: 'map', level: 1 },
        { id: 2, question: 'Q2', answer: 'A2', method: 'filter', level: 2 },
      ]);
    });
  });
});
