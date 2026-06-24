import { Injectable } from '@nestjs/common';
import { AbstractCustomerRepository } from '@modules/customer/domain/repositories/abstract-customer.repository';
import { Customer } from '@modules/customer/domain/entities/customer.entity';
import { DuplicateDocumentException } from '@modules/customer/domain/exceptions/duplicate-document.exception';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CustomerResponseDto } from '../dtos/customer-response.dto';

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly repo: AbstractCustomerRepository) {}

  async execute(dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const existing = await this.repo.findByDocument(dto.document);
    if (existing) throw new DuplicateDocumentException(dto.document);

    const customer = Customer.create({ name: dto.name, document: dto.document });
    await this.repo.save(customer);
    return CustomerResponseDto.fromEntity(customer);
  }
}
