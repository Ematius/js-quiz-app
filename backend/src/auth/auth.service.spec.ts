import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const userServiceMock = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  } as unknown as jest.Mocked<UserService>;

  const jwtServiceMock = {
    signAsync: jest.fn(),
  } as unknown as jest.Mocked<JwtService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('crea usuario, firma token y devuelve datos', async () => {
      const dto = { acc: 'acc1', email: 'a@a.com', pass: '123' };
      const hashed = 'hashedpass';
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(hashed as any);
      const newUser = { id: 1, acc: dto.acc, email: dto.email };
      userServiceMock.create.mockResolvedValueOnce(newUser as any);
      jwtServiceMock.signAsync.mockResolvedValueOnce('token123');

      const res = await service.register(dto as any);

      expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
      expect(userServiceMock.create).toHaveBeenCalledWith({
        acc: 'acc1',
        email: 'a@a.com',
        pass: hashed,
      });
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
        sub: 1,
        acc: 'acc1',
      });
      expect(res).toEqual({
        access_token: 'token123',
        user: { id: 1, acc: 'acc1', email: 'a@a.com' },
      });
    });

    it('lanza ConflictException si código P2002', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('x' as any);
      userServiceMock.create.mockRejectedValueOnce({ code: 'P2002' });

      await expect(service.register({} as any)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('lanza InternalServerErrorException si otro error', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('x' as any);
      userServiceMock.create.mockRejectedValueOnce(new Error('DB error'));

      await expect(service.register({} as any)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('login', () => {
    it('devuelve token y datos si credenciales correctas', async () => {
      const user = { id: 1, acc: 'acc', email: 'a@a.com', pass: 'hashed' };
      userServiceMock.findByEmail.mockResolvedValueOnce(user as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as any);
      jwtServiceMock.signAsync.mockResolvedValueOnce('tokenX');

      const res = await service.login('a@a.com', 'pass123');

      expect(userServiceMock.findByEmail).toHaveBeenCalledWith('a@a.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('pass123', 'hashed');
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
        sub: 1,
        acc: 'acc',
      });
      expect(res).toEqual({
        access_token: 'tokenX',
        user: { id: 1, acc: 'acc', email: 'a@a.com' },
      });
    });

    it('lanza Unauthorized si usuario no existe', async () => {
      userServiceMock.findByEmail.mockResolvedValueOnce(null);

      await expect(service.login('x@x.com', '123')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('lanza Unauthorized si contraseña incorrecta', async () => {
      const user = { id: 1, acc: 'acc', email: 'a@a.com', pass: 'hashed' };
      userServiceMock.findByEmail.mockResolvedValueOnce(user as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as any);

      await expect(service.login('a@a.com', 'wrong')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });
});
