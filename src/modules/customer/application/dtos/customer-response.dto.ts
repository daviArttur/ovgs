import { Customer } from '@modules/customer/domain/entities/customer.entity';

export class CustomerResponseDto {
  id!: string;
  name!: string;
  document!: string;
  authorizedTransportTypes!: string[];
  createdAt!: Date;
  updatedAt!: Date;

  static fromEntity(customer: Customer): CustomerResponseDto {
    const dto = new CustomerResponseDto();
    dto.id = customer.id;
    dto.name = customer.name;
    dto.document = customer.document;
    dto.authorizedTransportTypes = customer.authorizedTransportTypeIds;
    dto.createdAt = customer.createdAt;
    dto.updatedAt = customer.updatedAt;
    return dto;
  }
}
