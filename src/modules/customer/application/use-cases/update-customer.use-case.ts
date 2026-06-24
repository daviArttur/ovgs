import { Injectable } from '@nestjs/common';
import { AbstractCustomerRepository } from '@modules/customer/domain/repositories/abstract-customer.repository';
import { AbstractTransportTypeRepository } from '@modules/transport-type/domain/repositories/abstract-transport-type.repository';
import { CustomerNotFoundException } from '@modules/customer/domain/exceptions/customer-not-found.exception';
import { TransportTypeNotFoundException } from '@modules/transport-type/domain/exceptions/transport-type-not-found.exception';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { CustomerResponseDto } from '../dtos/customer-response.dto';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    private readonly customerRepo: AbstractCustomerRepository,
    private readonly transportTypeRepo: AbstractTransportTypeRepository,
  ) {}

  async execute(id: string, dto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    const customer = await this.customerRepo.findById(id);
    if (!customer) throw new CustomerNotFoundException(id);

    if (dto.name !== undefined) customer.updateName(dto.name);

    if (dto.authorizedTransportTypeIds !== undefined) {
      for (const ttId of dto.authorizedTransportTypeIds) {
        const exists = await this.transportTypeRepo.existsById(ttId);
        if (!exists) throw new TransportTypeNotFoundException(ttId);
      }
      customer.syncAuthorizedTransportTypes(dto.authorizedTransportTypeIds);
    }

    await this.customerRepo.save(customer);
    return CustomerResponseDto.fromEntity(customer);
  }
}
