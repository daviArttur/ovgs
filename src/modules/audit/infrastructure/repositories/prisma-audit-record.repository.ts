import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import {
  AbstractAuditRecordRepository,
  AuditFilters,
} from '@modules/audit/domain/repositories/abstract-audit-record.repository';
import { AuditRecord } from '@modules/audit/domain/entities/audit-record.entity';
import { PrismaAuditRecordMapper } from '../mappers/prisma-audit-record.mapper';

@Injectable()
export class PrismaAuditRecordRepository extends AbstractAuditRecordRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAll(filters?: AuditFilters): Promise<AuditRecord[]> {
    const where: Prisma.AuditRecordWhereInput = {};
    if (filters?.entityType) where.entityType = filters.entityType;
    if (filters?.entityId) where.entityId = filters.entityId;
    if (filters?.actionType) where.actionType = filters.actionType;

    const raws = await this.prisma.auditRecord.findMany({
      where,
      orderBy: { occurredAt: 'desc' },
    });
    return raws.map(PrismaAuditRecordMapper.toDomain);
  }

  async save(record: AuditRecord): Promise<void> {
    await this.prisma.auditRecord.create({
      data: {
        id: record.id,
        entityType: record.entityType,
        entityId: record.entityId,
        actionType: record.actionType,
        previousState: record.previousState !== null
          ? (record.previousState as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        newState: record.newState !== null
          ? (record.newState as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        occurredAt: record.occurredAt,
      },
    });
  }
}
