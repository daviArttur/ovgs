import { Injectable } from '@nestjs/common';
import { AbstractItemRepository } from '@modules/item/domain/repositories/abstract-item.repository';
import { ItemNotFoundException } from '@modules/item/domain/exceptions/item-not-found.exception';
import { ItemResponseDto } from '../dtos/item-response.dto';

@Injectable()
export class GetItemUseCase {
  constructor(private readonly repo: AbstractItemRepository) {}

  async execute(id: string): Promise<ItemResponseDto> {
    const item = await this.repo.findById(id);
    if (!item) throw new ItemNotFoundException(id);
    return ItemResponseDto.fromEntity(item);
  }
}
