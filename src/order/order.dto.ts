import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: 1, description: 'Ordered Menu ID' })
  menuId!: number;

  @ApiProperty({ example: 2, description: 'Number of portions purchased' })
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: () => [OrderItemDto], description: 'List of menu items ordered' })
  items!: OrderItemDto[];
}

export class PaymentDto {
  @ApiProperty({ example: 50000, description: 'The amount of money paid by the customer' })
  amountPaid!: number;

  @ApiProperty({ example: 'CASH', description: 'Payment method (CASH / QRIS)' })
  paymentMethod!: string;
}