import { TransportType as PrismaTransportType } from '@prisma/client';
import { TransportType } from '@modules/transport-type/domain/entities/transport-type.entity';

export class PrismaTransportTypeMapper {
  static toDomain(raw: PrismaTransportType): TransportType {
    return TransportType.reconstitute(
      raw.id,
      { name: raw.name, description: raw.description },
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPrisma(entity: TransportType): Omit<PrismaTransportType, 'createdAt' | 'updatedAt'> & { createdAt?: Date; updatedAt?: Date } {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
    };
  }
}
