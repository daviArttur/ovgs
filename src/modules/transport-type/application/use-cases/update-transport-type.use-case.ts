import { Injectable } from '@nestjs/common';
import { AbstractTransportTypeRepository } from '@modules/transport-type/domain/repositories/abstract-transport-type.repository';
import { TransportTypeNotFoundException } from '@modules/transport-type/domain/exceptions/transport-type-not-found.exception';
import { DuplicateTransportTypeNameException } from '@modules/transport-type/domain/exceptions/duplicate-transport-type-name.exception';
import { UpdateTransportTypeDto } from '../dtos/update-transport-type.dto';
import { TransportTypeResponseDto } from '../dtos/transport-type-response.dto';

@Injectable()
export class UpdateTransportTypeUseCase {
  constructor(private readonly repo: AbstractTransportTypeRepository) {}

  async execute(id: string, dto: UpdateTransportTypeDto): Promise<TransportTypeResponseDto> {
    const entity = await this.repo.findById(id);
    if (!entity) throw new TransportTypeNotFoundException(id);

    if (dto.name !== undefined && dto.name !== entity.name) {
      const existing = await this.repo.findByName(dto.name);
      if (existing) throw new DuplicateTransportTypeNameException(dto.name);
      entity.updateName(dto.name);
    }

    if (dto.description !== undefined) entity.updateDescription(dto.description);

    await this.repo.save(entity);
    return TransportTypeResponseDto.fromEntity(entity);
  }
}
