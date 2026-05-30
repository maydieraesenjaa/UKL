import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.menu.create({ 
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        isAvailable: data.isAvailable ?? true,
      }
    });
  }

  async findAll() {
    return this.prisma.menu.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: number) {
    const menu = await this.prisma.menu.findUnique({ where: { id } });
    if (!menu) throw new NotFoundException('Menu not found!');
    return menu;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    
    if (data.price) data.price = Number(data.price);
    
    return this.prisma.menu.update({ 
      where: { id }, 
      data 
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.menu.delete({ where: { id } });
  }
}