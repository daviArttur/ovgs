import { Module } from '@nestjs/common';
import { AbstractTransportTypeRepository } from './domain/repositories/abstract-transport-type.repository';
import { PrismaTransportTypeRepository } from './infrastructure/repositories/prisma-transport-type.repository';
import { CreateTransportTypeUseCase } from './application/use-cases/create-transport-type.use-case';
import { UpdateTransportTypeUseCase } from './application/use-cases/update-transport-type.use-case';
import { GetTransportTypeUseCase } from './application/use-cases/get-transport-type.use-case';
import { ListTransportTypesUseCase } from './application/use-cases/list-transport-types.use-case';
import { TransportTypeController } from './presentation/transport-type.controller';

@Module({
  controllers: [TransportTypeController],
  providers: [
    { provide: AbstractTransportTypeRepository, useClass: PrismaTransportTypeRepository },
    CreateTransportTypeUseCase,
    UpdateTransportTypeUseCase,
    GetTransportTypeUseCase,
    ListTransportTypesUseCase,
  ],
  exports: [
    AbstractTransportTypeRepository,
    CreateTransportTypeUseCase,
    UpdateTransportTypeUseCase,
    GetTransportTypeUseCase,
    ListTransportTypesUseCase,
  ],
})
export class TransportTypeModule {}
