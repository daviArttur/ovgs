import { Injectable } from '@nestjs/common';
import { AbstractSalesOrderRepository, SalesOrderFilters } from '@modules/sales-order/domain/repositories/abstract-sales-order.repository';
import { SalesOrderFiltersDto } from '../dtos/sales-order-filters.dto';
import { SalesOrderResponseDto } from '../dtos/sales-order-response.dto';

@Injectable()
export class ListSalesOrdersUseCase {
  constructor(private readonly repo: AbstractSalesOrderRepository) {}

  async execute(filtersDto?: SalesOrderFiltersDto): Promise<SalesOrderResponseDto[]> {
    const filters: SalesOrderFilters = {};
    if (filtersDto) {
      if (filtersDto.status) filters.status = filtersDto.status;
      if (filtersDto.customerId) filters.customerId = filtersDto.customerId;
      if (filtersDto.transportTypeId) filters.transportTypeId = filtersDto.transportTypeId;
      if (filtersDto.date) filters.date = new Date(filtersDto.date);
    }
    const orders = await this.repo.findAll(filters);
    return orders.map(SalesOrderResponseDto.fromEntity);
  }
}
