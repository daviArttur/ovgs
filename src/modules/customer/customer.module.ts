import { Module } from '@nestjs/common';
import { TransportTypeModule } from '@modules/transport-type/transport-type.module';
import { AbstractCustomerRepository } from './domain/repositories/abstract-customer.repository';
import { PrismaCustomerRepository } from './infrastructure/repositories/prisma-customer.repository';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { GetCustomerUseCase } from './application/use-cases/get-customer.use-case';
import { ListCustomersUseCase } from './application/use-cases/list-customers.use-case';
import { UpdateCustomerUseCase } from './application/use-cases/update-customer.use-case';
import { AuthorizeTransportTypeUseCase } from './application/use-cases/authorize-transport-type.use-case';
import { CustomerController } from './presentation/customer.controller';

@Module({
  imports: [TransportTypeModule],
  controllers: [CustomerController],
  providers: [
    { provide: AbstractCustomerRepository, useClass: PrismaCustomerRepository },
    CreateCustomerUseCase,
    GetCustomerUseCase,
    ListCustomersUseCase,
    UpdateCustomerUseCase,
    AuthorizeTransportTypeUseCase,
  ],
  exports: [
    AbstractCustomerRepository,
    CreateCustomerUseCase,
    GetCustomerUseCase,
    ListCustomersUseCase,
    UpdateCustomerUseCase,
    AuthorizeTransportTypeUseCase,
  ],
})
export class CustomerModule {}
