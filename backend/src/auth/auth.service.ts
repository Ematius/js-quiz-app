import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import  { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(dto: CreateUserDto) {
    try {
      const hashedPass = await bcrypt.hash(dto.pass, 10);
      const newUser = await this.userService.create({
        acc: dto.acc,
        email: dto.email,
        pass: hashedPass,
      });

      const payload = { sub: newUser.id, acc: newUser.acc };
      const token = await this.jwtService.signAsync(payload);

      return {
        access_token: token,
        user: { id: newUser.id, acc: newUser.acc, email: newUser.email },
      };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('El email ya está registrado');
      }

      throw new InternalServerErrorException('Error al registrar el usuario');
    }
  }

  async login(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user.id, acc: user.acc };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: { id: user.id, acc: user.acc, email: user.email },
    };
  }
}

