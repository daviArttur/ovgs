import { Item as PrismaItem } from '@prisma/client';
import { Item } from '@modules/item/domain/entities/item.entity';

export class PrismaItemMapper {
  static toDomain(raw: PrismaItem): Item {
    return Item.reconstitute(
      raw.id,
      { sku: raw.sku, name: raw.name, description: raw.description },
      raw.createdAt,
      raw.updatedAt,
    );
  }
}
