
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;

  const prismaMock = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  } as unknown as PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear usuario con los datos y devolverlo', async () => {
      const dto = { acc: 'acc123', email: 'a@a.com', pass: 'secret' };
      const user = { id: 1, ...dto };
      (prismaMock.user.create as jest.Mock).mockResolvedValueOnce(user);

      const result = await service.create(dto);

      expect(prismaMock.user.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(user);
    });

    it('propaga errores de Prisma', async () => {
      const dto = { acc: 'acc123', email: 'a@a.com', pass: 'secret' };
      (prismaMock.user.create as jest.Mock).mockRejectedValueOnce(
        new Error('DB'),
      );

      await expect(service.create(dto)).rejects.toThrow('DB');
    });
  });

  describe('findByEmail', () => {
    it('debe buscar por email y devolver el usuario', async () => {
      const email = 'a@a.com';
      const user = { id: 1, acc: 'acc123', email, pass: 'secret' };
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValueOnce(user);

      const result = await service.findByEmail(email);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(user);
    });

    it('devuelve null si no existe', async () => {
      const email = 'notfound@a.com';
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const result = await service.findByEmail(email);

      expect(result).toBeNull();
    });
  });
});
