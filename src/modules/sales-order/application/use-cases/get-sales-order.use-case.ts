import { Injectable } from '@nestjs/common';
import { AbstractSalesOrderRepository } from '@modules/sales-order/domain/repositories/abstract-sales-order.repository';
import { SalesOrderNotFoundException } from '@modules/sales-order/domain/exceptions/sales-order-not-found.exception';
import { SalesOrderDetailResponseDto } from '../dtos/sales-order-response.dto';

@Injectable()
export class GetSalesOrderUseCase {
  constructor(private readonly repo: AbstractSalesOrderRepository) {}

  async execute(id: string): Promise<SalesOrderDetailResponseDto> {
    const order = await this.repo.findById(id);
    if (!order) throw new SalesOrderNotFoundException(id);
    return SalesOrderDetailResponseDto.fromEntity(order);
  }
}
