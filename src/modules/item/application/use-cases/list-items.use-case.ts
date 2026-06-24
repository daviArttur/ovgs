import { Injectable } from '@nestjs/common';
import { AbstractItemRepository } from '@modules/item/domain/repositories/abstract-item.repository';
import { ItemResponseDto } from '../dtos/item-response.dto';

@Injectable()
export class ListItemsUseCase {
  constructor(private readonly repo: AbstractItemRepository) {}

  async execute(): Promise<ItemResponseDto[]> {
    const items = await this.repo.findAll();
    return items.map(ItemResponseDto.fromEntity);
  }
}
