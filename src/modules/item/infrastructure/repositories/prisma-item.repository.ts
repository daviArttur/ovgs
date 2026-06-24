import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { AbstractItemRepository } from '@modules/item/domain/repositories/abstract-item.repository';
import { Item } from '@modules/item/domain/entities/item.entity';
import { PrismaItemMapper } from '../mappers/prisma-item.mapper';

@Injectable()
export class PrismaItemRepository extends AbstractItemRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<Item | null> {
    const raw = await this.prisma.item.findUnique({ where: { id } });
    return raw ? PrismaItemMapper.toDomain(raw) : null;
  }

  async findBySku(sku: string): Promise<Item | null> {
    const raw = await this.prisma.item.findUnique({ where: { sku } });
    return raw ? PrismaItemMapper.toDomain(raw) : null;
  }

  async findAllByIds(ids: string[]): Promise<Item[]> {
    const raws = await this.prisma.item.findMany({ where: { id: { in: ids } } });
    return raws.map(PrismaItemMapper.toDomain);
  }

  async findAll(): Promise<Item[]> {
    const raws = await this.prisma.item.findMany({ orderBy: { createdAt: 'asc' } });
    return raws.map(PrismaItemMapper.toDomain);
  }

  async save(item: Item): Promise<void> {
    await this.prisma.item.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        sku: item.sku,
        name: item.name,
        description: item.description,
      },
      update: {
        sku: item.sku,
        name: item.name,
        description: item.description,
      },
    });
  }
}
