import { Injectable } from '@nestjs/common';
import { AbstractTransportTypeRepository } from '@modules/transport-type/domain/repositories/abstract-transport-type.repository';
import { TransportType } from '@modules/transport-type/domain/entities/transport-type.entity';
import { DuplicateTransportTypeNameException } from '@modules/transport-type/domain/exceptions/duplicate-transport-type-name.exception';
import { CreateTransportTypeDto } from '../dtos/create-transport-type.dto';
import { TransportTypeResponseDto } from '../dtos/transport-type-response.dto';

@Injectable()
export class CreateTransportTypeUseCase {
  constructor(private readonly repo: AbstractTransportTypeRepository) {}

  async execute(dto: CreateTransportTypeDto): Promise<TransportTypeResponseDto> {
    const existing = await this.repo.findByName(dto.name);
    if (existing) throw new DuplicateTransportTypeNameException(dto.name);

    const entity = TransportType.create({ name: dto.name, description: dto.description });
    await this.repo.save(entity);
    return TransportTypeResponseDto.fromEntity(entity);
  }
}
