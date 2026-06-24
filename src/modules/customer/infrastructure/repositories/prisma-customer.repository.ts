import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { AbstractCustomerRepository } from '@modules/customer/domain/repositories/abstract-customer.repository';
import { Customer } from '@modules/customer/domain/entities/customer.entity';
import { PrismaCustomerMapper } from '../mappers/prisma-customer.mapper';

const INCLUDE_RELATIONS = { authorizedTransports: true } as const;

@Injectable()
export class PrismaCustomerRepository extends AbstractCustomerRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<Customer | null> {
    const raw = await this.prisma.customer.findUnique({
      where: { id },
      include: INCLUDE_RELATIONS,
    });
    return raw ? PrismaCustomerMapper.toDomain(raw) : null;
  }

  async findByDocument(document: string): Promise<Customer | null> {
    const raw = await this.prisma.customer.findUnique({
      where: { document },
      include: INCLUDE_RELATIONS,
    });
    return raw ? PrismaCustomerMapper.toDomain(raw) : null;
  }

  async findAll(): Promise<Customer[]> {
    const raws = await this.prisma.customer.findMany({
      include: INCLUDE_RELATIONS,
      orderBy: { createdAt: 'asc' },
    });
    return raws.map(PrismaCustomerMapper.toDomain);
  }

  async save(customer: Customer): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.customer.upsert({
        where: { id: customer.id },
        create: {
          id: customer.id,
          name: customer.name,
          document: customer.document,
        },
        update: {
          name: customer.name,
          document: customer.document,
        },
      }),
      this.prisma.customerAuthorizedTransport.deleteMany({
        where: { customerId: customer.id },
      }),
      this.prisma.customerAuthorizedTransport.createMany({
        data: customer.authorizedTransportTypeIds.map((ttId) => ({
          customerId: customer.id,
          transportTypeId: ttId,
        })),
        skipDuplicates: true,
      }),
    ]);
  }
}
