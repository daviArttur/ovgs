import { Injectable } from '@nestjs/common';
import { AbstractTransportTypeRepository } from '@modules/transport-type/domain/repositories/abstract-transport-type.repository';
import { TransportTypeResponseDto } from '../dtos/transport-type-response.dto';

@Injectable()
export class ListTransportTypesUseCase {
  constructor(private readonly repo: AbstractTransportTypeRepository) {}

  async execute(): Promise<TransportTypeResponseDto[]> {
    const entities = await this.repo.findAll();
    return entities.map(TransportTypeResponseDto.fromEntity);
  }
}
