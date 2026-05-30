import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private hashPassword(password: string): string {
    return crypto.createHash('md5').update(password).digest('hex');
  }

  async register(data: any) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUser) {
      throw new BadRequestException('Username is already in use!');
    }

    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        password: this.hashPassword(data.password),
        role: data.role || 'USER',
      },
    });

    return { message: 'Registration successful', userId: user.id };
  }

  async login(data: any) {
    const user = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (!user || user.password !== this.hashPassword(data.password)) {
      throw new UnauthorizedException('Incorrect username or password!');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    
    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
      role: user.role
    };
  }
}