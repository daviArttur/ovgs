import { Injectable } from '@nestjs/common';
import { AbstractCustomerRepository } from '@modules/customer/domain/repositories/abstract-customer.repository';
import { CustomerResponseDto } from '../dtos/customer-response.dto';

@Injectable()
export class ListCustomersUseCase {
  constructor(private readonly repo: AbstractCustomerRepository) {}

  async execute(): Promise<CustomerResponseDto[]> {
    const customers = await this.repo.findAll();
    return customers.map(CustomerResponseDto.fromEntity);
  }
}
