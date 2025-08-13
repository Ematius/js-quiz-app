import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

describe('QuestionController', () => {
  let controller: QuestionController;

  const serviceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    getNextQuestion: jest.fn(),
    registerProgress: jest.fn(),
    answerInvite: jest.fn(),
    toggleFavorite: jest.fn(),
    getFavorites: jest.fn(),
  } as unknown as jest.Mocked<QuestionService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [{ provide: QuestionService, useValue: serviceMock }],
    }).compile();

    controller = module.get<QuestionController>(QuestionController);
  });

  it('debería definirse', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /question', () => {
    it('findAll delega en QuestionService.findAll', async () => {
      const list = [{ id: 1 }] as any;
      serviceMock.findAll.mockResolvedValueOnce(list);

      const res = await controller.findAll();

      expect(serviceMock.findAll).toHaveBeenCalledTimes(1);
      expect(res).toBe(list);
    });
  });

  describe('GET /question/invite/next', () => {
    it('sin lastId: pasa undefined al servicio', async () => {
      const q = { id: 1 } as any;
      serviceMock.getNextQuestion.mockResolvedValueOnce(q);

      const res = await controller.getNextQuestion(undefined as any);

      expect(serviceMock.getNextQuestion).toHaveBeenCalledWith(undefined);
      expect(res).toBe(q);
    });

    it('con lastId: delega correctamente', async () => {
      const q = { id: 5 } as any;
      serviceMock.getNextQuestion.mockResolvedValueOnce(q);

      const res = await controller.getNextQuestion(3 as any);

      expect(serviceMock.getNextQuestion).toHaveBeenCalledWith(3);
      expect(res).toBe(q);
    });
  });

  describe('GET /question/acc/next (protegida)', () => {
    it('pasa el lastId (ya number en test unitario)', async () => {
      const q = { id: 9 } as any;
      serviceMock.getNextQuestion.mockResolvedValueOnce(q);

      const res = await controller.getNextQuestionWithAcc(8 as any);

      expect(serviceMock.getNextQuestion).toHaveBeenCalledWith(8);
      expect(res).toBe(q);
    });
  });

  describe('GET /question/favorites (protegida)', () => {
    it('usa req.user.id', async () => {
      const favorites = [{ id: 1 }] as any;
      serviceMock.getFavorites.mockResolvedValueOnce(favorites);

      const res = await controller.getFavorites({ user: { id: 77 } } as any);

      expect(serviceMock.getFavorites).toHaveBeenCalledWith(77);
      expect(res).toBe(favorites);
    });
  });

  describe('GET /question/:id', () => {
    it('convierte id a number y delega', async () => {
      const q = { id: 10 } as any;
      serviceMock.findOne.mockResolvedValueOnce(q);

      const res = await controller.findOne('10');

      expect(serviceMock.findOne).toHaveBeenCalledWith(10);
      expect(res).toBe(q);
    });
  });

  describe('POST /question/invite/answer', () => {
    it('envía el dto a answerInvite', async () => {
      const dto = { questionId: 3, answer: 'A' } as any;
      const result = { isCorrect: true, correctAnswer: 'A' };
      serviceMock.answerInvite.mockResolvedValueOnce(result as any);

      const res = await controller.answerInvite(dto);

      expect(serviceMock.answerInvite).toHaveBeenCalledWith(dto);
      expect(res).toBe(result as any);
    });
  });

  describe('POST /question/answer (protegida)', () => {
    it('envía el dto a registerProgress', async () => {
      const dto = { userId: 1, questionId: 2, answer: 'X' } as any;
      const result = { isCorrect: false };
      serviceMock.registerProgress.mockResolvedValueOnce(result as any);

      const res = await controller.registerProgress(dto);

      expect(serviceMock.registerProgress).toHaveBeenCalledWith(dto);
      expect(res).toBe(result as any);
    });
  });

  describe('POST /question/favorite/toggle (protegida)', () => {
    it('pasa req.user.id y dto.questionId', async () => {
      const req = { user: { id: 5 } } as any;
      const dto = { questionId: 42 } as any;
      const result = { favorite: true, message: 'Añadida a favoritos' };
      serviceMock.toggleFavorite.mockResolvedValueOnce(result as any);

      const res = await controller.toggleFavorite(req, dto);

      expect(serviceMock.toggleFavorite).toHaveBeenCalledWith(5, 42);
      expect(res).toBe(result as any);
    });
  });
});
