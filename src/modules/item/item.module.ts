import { Module } from '@nestjs/common';
import { AbstractItemRepository } from './domain/repositories/abstract-item.repository';
import { PrismaItemRepository } from './infrastructure/repositories/prisma-item.repository';
import { CreateItemUseCase } from './application/use-cases/create-item.use-case';
import { GetItemUseCase } from './application/use-cases/get-item.use-case';
import { ListItemsUseCase } from './application/use-cases/list-items.use-case';
import { ItemController } from './presentation/item.controller';

@Module({
  controllers: [ItemController],
  providers: [
    { provide: AbstractItemRepository, useClass: PrismaItemRepository },
    CreateItemUseCase,
    GetItemUseCase,
    ListItemsUseCase,
  ],
  exports: [
    AbstractItemRepository,
    CreateItemUseCase,
    GetItemUseCase,
    ListItemsUseCase,
  ],
})
export class ItemModule {}
