import { Injectable } from '@nestjs/common';
import { AbstractCustomerRepository } from '@modules/customer/domain/repositories/abstract-customer.repository';
import { CustomerNotFoundException } from '@modules/customer/domain/exceptions/customer-not-found.exception';
import { CustomerResponseDto } from '../dtos/customer-response.dto';

@Injectable()
export class GetCustomerUseCase {
  constructor(private readonly repo: AbstractCustomerRepository) {}

  async execute(id: string): Promise<CustomerResponseDto> {
    const customer = await this.repo.findById(id);
    if (!customer) throw new CustomerNotFoundException(id);
    return CustomerResponseDto.fromEntity(customer);
  }
}
