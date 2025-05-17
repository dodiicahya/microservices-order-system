import { Controller, Post, Body} from '@nestjs/common';
import { CreateOrderDto } from './create-order.dto';
import { OrderService } from './order.service';
import { BasicAuthGuard } from './auth/basic-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  
  @UseGuards(BasicAuthGuard)
  @Post()
  async create(@Body() orderData: CreateOrderDto): Promise<CreateOrderDto> {
    return this.orderService.createOrder(orderData);
  }
}
