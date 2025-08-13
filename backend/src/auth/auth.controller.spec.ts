import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const serviceMock = {
    register: jest.fn(),
    login: jest.fn(),
  } as unknown as jest.Mocked<AuthService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: serviceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /auth/register', () => {
    it('pasa el dto a AuthService.register y devuelve el resultado', async () => {
      const dto = { acc: 'acc1', email: 'a@a.com', pass: '123' };
      const result = {
        access_token: 't1',
        user: { id: 1, acc: 'acc1', email: 'a@a.com' },
      };
      serviceMock.register.mockResolvedValueOnce(result);

      const res = await controller.register(dto);

      expect(serviceMock.register).toHaveBeenCalledWith(dto);
      expect(res).toBe(result);
    });
  });

  describe('POST /auth/login', () => {
    it('pasa email y pass a AuthService.login y devuelve el resultado', async () => {
      const email = 'a@a.com';
      const pass = '123';
      const result = {
        access_token: 't2',
        user: { id: 2, acc: 'acc2', email: 'b@b.com' },
      };
      serviceMock.login.mockResolvedValueOnce(result);

      const res = await controller.login(email, pass);

      expect(serviceMock.login).toHaveBeenCalledWith(email, pass);
      expect(res).toBe(result);
    });
  });
});
