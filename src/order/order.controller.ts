import { Controller, Post, Body, Req, UseGuards, Param, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(Role.ADMIN, Role.USER)
  @Post()
  createOrder(@Req() req: any, @Body() body: { items: { menuId: number; quantity: number }[] }) {
    const userId = req.user.userId; 
    return this.orderService.createOrder(userId, body);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Post(':id/pay')
  processPayment(
    @Param('id') id: string,
    @Body() body: { amountPaid: number; paymentMethod: string }
  ) {
    return this.orderService.processPayment(Number(id), body);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get('history')
  getHistory() {
    return this.orderService.getHistory();
  }
}