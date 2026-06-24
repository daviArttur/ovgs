import { Injectable } from '@nestjs/common';
import { AbstractTransportTypeRepository } from '@modules/transport-type/domain/repositories/abstract-transport-type.repository';
import { TransportTypeNotFoundException } from '@modules/transport-type/domain/exceptions/transport-type-not-found.exception';
import { TransportTypeResponseDto } from '../dtos/transport-type-response.dto';

@Injectable()
export class GetTransportTypeUseCase {
  constructor(private readonly repo: AbstractTransportTypeRepository) {}

  async execute(id: string): Promise<TransportTypeResponseDto> {
    const entity = await this.repo.findById(id);
    if (!entity) throw new TransportTypeNotFoundException(id);
    return TransportTypeResponseDto.fromEntity(entity);
  }
}
