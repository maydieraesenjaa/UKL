import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number, dto: { items: { menuId: number; quantity: number }[] }) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order items cannot be empty!');
    }

    return this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderDetailsData: { menuId: number; quantity: number; subtotal: number }[] = [];
      
      for (const item of dto.items) {
        const menu = await tx.menu.findUnique({ where: { id: item.menuId } });
        
        if (!menu) {
          throw new NotFoundException(`Menu with ID ${item.menuId} not found!`);
        }
        if (!menu.isAvailable) {
          throw new BadRequestException(`Menu "${menu.name}" is currently unavailable!`);
        }

        const subtotal = menu.price * item.quantity;
        totalAmount += subtotal;

        orderDetailsData.push({
          menuId: item.menuId,
          quantity: item.quantity,
          subtotal: subtotal,
        });
      }

      const order = await tx.order.create({
        data: {
          userId: userId,
          totalAmount: totalAmount,
          status: 'PENDING',
          details: {
            create: orderDetailsData,
          },
        },
        include: {
          details: true,
        },
      });

      return {
        message: 'Order successfully recorded',
        order,
      };
    });
  }

  async processPayment(orderId: number, dto: { amountPaid: number; paymentMethod: string }) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) throw new NotFoundException('Order not found!');
      if (order.status !== 'PENDING') throw new BadRequestException('This order has already been processed!');

      if (dto.amountPaid < order.totalAmount) {
        throw new BadRequestException(`Not enough money! The total bill is Rp ${order.totalAmount}`);
      }

      const payment = await tx.payment.create({
        data: {
          orderId: orderId,
          amountPaid: Number(dto.amountPaid),
          paymentMethod: dto.paymentMethod,
        },
      });

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: 'PAID' },
      });

      const kembalian = dto.amountPaid - order.totalAmount;

      return {
        message: 'Payment confirmed successfully',
        orderId: updatedOrder.id,
        status: updatedOrder.status,
        totalAmount: updatedOrder.totalAmount,
        amountPaid: payment.amountPaid,
        change: kembalian,
        paymentMethod: payment.paymentMethod,
      };
    });
  }

  async getHistory() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: { username: true, role: true },
        },
        details: {
          include: {
            menu: { select: { name: true, price: true } },
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteOrder(id: number) {
  await this.prisma.orderDetail.deleteMany({
    where: { orderId: id },
  });

  return this.prisma.order.delete({
    where: { id: id },
  });
}
}