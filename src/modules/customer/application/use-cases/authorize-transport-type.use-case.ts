import { Injectable } from '@nestjs/common';
import { AbstractCustomerRepository } from '@modules/customer/domain/repositories/abstract-customer.repository';
import { AbstractTransportTypeRepository } from '@modules/transport-type/domain/repositories/abstract-transport-type.repository';
import { CustomerNotFoundException } from '@modules/customer/domain/exceptions/customer-not-found.exception';
import { TransportTypeNotFoundException } from '@modules/transport-type/domain/exceptions/transport-type-not-found.exception';
import { CustomerResponseDto } from '../dtos/customer-response.dto';

@Injectable()
export class AuthorizeTransportTypeUseCase {
  constructor(
    private readonly customerRepo: AbstractCustomerRepository,
    private readonly transportTypeRepo: AbstractTransportTypeRepository,
  ) {}

  async execute(customerId: string, transportTypeId: string): Promise<CustomerResponseDto> {
    const customer = await this.customerRepo.findById(customerId);
    if (!customer) throw new CustomerNotFoundException(customerId);

    const exists = await this.transportTypeRepo.existsById(transportTypeId);
    if (!exists) throw new TransportTypeNotFoundException(transportTypeId);

    customer.authorizeTransportType(transportTypeId);
    await this.customerRepo.save(customer);
    return CustomerResponseDto.fromEntity(customer);
  }
}
