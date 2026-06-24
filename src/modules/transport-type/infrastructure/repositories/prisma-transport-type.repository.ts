import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { AbstractTransportTypeRepository } from '@modules/transport-type/domain/repositories/abstract-transport-type.repository';
import { TransportType } from '@modules/transport-type/domain/entities/transport-type.entity';
import { PrismaTransportTypeMapper } from '../mappers/prisma-transport-type.mapper';

@Injectable()
export class PrismaTransportTypeRepository extends AbstractTransportTypeRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<TransportType | null> {
    const raw = await this.prisma.transportType.findUnique({ where: { id } });
    return raw ? PrismaTransportTypeMapper.toDomain(raw) : null;
  }

  async findByName(name: string): Promise<TransportType | null> {
    const raw = await this.prisma.transportType.findUnique({ where: { name } });
    return raw ? PrismaTransportTypeMapper.toDomain(raw) : null;
  }

  async findAll(): Promise<TransportType[]> {
    const raws = await this.prisma.transportType.findMany({ orderBy: { createdAt: 'asc' } });
    return raws.map(PrismaTransportTypeMapper.toDomain);
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.transportType.count({ where: { id } });
    return count > 0;
  }

  async save(entity: TransportType): Promise<void> {
    await this.prisma.transportType.upsert({
      where: { id: entity.id },
      create: {
        id: entity.id,
        name: entity.name,
        description: entity.description,
      },
      update: {
        name: entity.name,
        description: entity.description,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transportType.delete({ where: { id } });
  }
}
