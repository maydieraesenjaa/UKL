import { Controller, Post, Body, Req, UseGuards, Param, Get, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(Role.ADMIN, Role.USER)
  @Post()
  @ApiOperation({ summary: 'Add order'})
  createOrder(@Req() req: any, @Body() body: { items: { menuId: number; quantity: number }[] }) {
    const userId = req.user.userId; 
    return this.orderService.createOrder(userId, body);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Post(':id/pay')
  @ApiOperation({ summary: 'Payment orders with id'})
  processPayment(
    @Param('id') id: string,
    @Body() body: { amountPaid: number; paymentMethod: string }
  ) {
    return this.orderService.processPayment(Number(id), body);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get('history')
  @ApiOperation({ summary: 'Displays all order data'})
  getHistory() {
    return this.orderService.getHistory();
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete menu data with id'})
  removeOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(Number(id));
  }
}