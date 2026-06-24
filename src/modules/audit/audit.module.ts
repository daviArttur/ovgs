import { Module } from '@nestjs/common';
import { AbstractAuditRecordRepository } from './domain/repositories/abstract-audit-record.repository';
import { PrismaAuditRecordRepository } from './infrastructure/repositories/prisma-audit-record.repository';
import { ListAuditRecordsUseCase } from './application/use-cases/list-audit-records.use-case';
import { SalesOrderCreatedHandler } from './application/handlers/sales-order-created.handler';
import { SalesOrderStatusChangedHandler } from './application/handlers/sales-order-status-changed.handler';
import { DeliveryScheduledHandler } from './application/handlers/delivery-scheduled.handler';
import { DeliveryRescheduledHandler } from './application/handlers/delivery-rescheduled.handler';
import { DeliveryConfirmedHandler } from './application/handlers/delivery-confirmed.handler';
import { TransportTypeChangedHandler } from './application/handlers/transport-type-changed.handler';
import { AuditController } from './presentation/audit.controller';

@Module({
  controllers: [AuditController],
  providers: [
    { provide: AbstractAuditRecordRepository, useClass: PrismaAuditRecordRepository },
    ListAuditRecordsUseCase,
    SalesOrderCreatedHandler,
    SalesOrderStatusChangedHandler,
    DeliveryScheduledHandler,
    DeliveryRescheduledHandler,
    DeliveryConfirmedHandler,
    TransportTypeChangedHandler,
  ],
  exports: [AbstractAuditRecordRepository, ListAuditRecordsUseCase],
})
export class AuditModule {}
