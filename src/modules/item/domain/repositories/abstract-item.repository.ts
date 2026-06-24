import { Item } from '../entities/item.entity';

export abstract class AbstractItemRepository {
  abstract findById(id: string): Promise<Item | null>;
  abstract findBySku(sku: string): Promise<Item | null>;
  abstract findAllByIds(ids: string[]): Promise<Item[]>;
  abstract findAll(): Promise<Item[]>;
  abstract save(item: Item): Promise<void>;
}
