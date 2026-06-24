import { Injectable } from '@nestjs/common';
import { AbstractItemRepository } from '@modules/item/domain/repositories/abstract-item.repository';
import { Item } from '@modules/item/domain/entities/item.entity';
import { DuplicateSkuException } from '@modules/item/domain/exceptions/duplicate-sku.exception';
import { CreateItemDto } from '../dtos/create-item.dto';
import { ItemResponseDto } from '../dtos/item-response.dto';

@Injectable()
export class CreateItemUseCase {
  constructor(private readonly repo: AbstractItemRepository) {}

  async execute(dto: CreateItemDto): Promise<ItemResponseDto> {
    const existing = await this.repo.findBySku(dto.sku);
    if (existing) throw new DuplicateSkuException(dto.sku);

    const item = Item.create({ sku: dto.sku, name: dto.name, description: dto.description });
    await this.repo.save(item);
    return ItemResponseDto.fromEntity(item);
  }
}
