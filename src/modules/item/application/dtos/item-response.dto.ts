import { Item } from '@modules/item/domain/entities/item.entity';

export class ItemResponseDto {
  id!: string;
  sku!: string;
  name!: string;
  description!: string | null;
  createdAt!: Date;
  updatedAt!: Date;

  static fromEntity(item: Item): ItemResponseDto {
    const dto = new ItemResponseDto();
    dto.id = item.id;
    dto.sku = item.sku;
    dto.name = item.name;
    dto.description = item.description;
    dto.createdAt = item.createdAt;
    dto.updatedAt = item.updatedAt;
    return dto;
  }
}
