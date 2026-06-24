import { TransportType } from '@modules/transport-type/domain/entities/transport-type.entity';

export class TransportTypeResponseDto {
  id!: string;
  name!: string;
  description!: string | null;
  createdAt!: Date;
  updatedAt!: Date;

  static fromEntity(entity: TransportType): TransportTypeResponseDto {
    const dto = new TransportTypeResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
