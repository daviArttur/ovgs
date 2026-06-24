import { Customer as PrismaCustomer, CustomerAuthorizedTransport } from '@prisma/client';
import { Customer } from '@modules/customer/domain/entities/customer.entity';

type CustomerWithRelations = PrismaCustomer & {
  authorizedTransports: CustomerAuthorizedTransport[];
};

export class PrismaCustomerMapper {
  static toDomain(raw: CustomerWithRelations): Customer {
    return Customer.reconstitute(
      raw.id,
      {
        name: raw.name,
        document: raw.document,
        authorizedTransportTypeIds: raw.authorizedTransports.map((t) => t.transportTypeId),
      },
      raw.createdAt,
      raw.updatedAt,
    );
  }
}
