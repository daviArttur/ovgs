import { APP_INTERCEPTOR } from '@nestjs/core';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggingInterceptor } from '@shared/presentation/interceptors/logging.interceptor';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';
import { TransportTypeModule } from '@modules/transport-type/transport-type.module';
import { ItemModule } from '@modules/item/item.module';
import { CustomerModule } from '@modules/customer/customer.module';
import { SalesOrderModule } from '@modules/sales-order/sales-order.module';
import { AuditModule } from '@modules/audit/audit.module';
import { CorrelationIdMiddleware } from '@shared/presentation/middleware/correlation-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport: {
          targets: [
            ...(process.env.NODE_ENV !== 'production'
              ? [{ target: 'pino-pretty', options: { colorize: true }, level: 'debug' }]
              : []),
            {
              target: 'pino/file',
              options: {
                destination: process.env.LOG_FILE ?? './logs/app.log',
                mkdir: true,
              },
              level: 'info',
            },
          ],
        },
        customProps: (req) => ({
          correlationId: req.headers['x-correlation-id'],
        }),
      },
    }),
    PrismaModule,
    TransportTypeModule,
    ItemModule,
    CustomerModule,
    SalesOrderModule,
    AuditModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
