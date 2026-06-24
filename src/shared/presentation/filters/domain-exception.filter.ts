import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '@shared/domain/exceptions/domain.exception';

const STATUS_MAP: Record<string, HttpStatus> = {
  TRANSPORT_TYPE_NOT_FOUND: HttpStatus.NOT_FOUND,
  CUSTOMER_NOT_FOUND: HttpStatus.NOT_FOUND,
  ITEM_NOT_FOUND: HttpStatus.NOT_FOUND,
  SALES_ORDER_NOT_FOUND: HttpStatus.NOT_FOUND,
  DUPLICATE_SKU: HttpStatus.CONFLICT,
  DUPLICATE_DOCUMENT: HttpStatus.CONFLICT,
  DUPLICATE_TRANSPORT_TYPE_NAME: HttpStatus.CONFLICT,
  INVALID_STATUS_TRANSITION: HttpStatus.UNPROCESSABLE_ENTITY,
  INVALID_DELIVERY_SCHEDULING_STATE: HttpStatus.UNPROCESSABLE_ENTITY,
  DELIVERY_ALREADY_SCHEDULED: HttpStatus.CONFLICT,
  NO_DELIVERY_SCHEDULE: HttpStatus.UNPROCESSABLE_ENTITY,
  TRANSPORT_TYPE_NOT_AUTHORIZED: HttpStatus.UNPROCESSABLE_ENTITY,
};

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = STATUS_MAP[exception.code] ?? HttpStatus.BAD_REQUEST;

    response.status(statusCode).json({
      statusCode,
      error: exception.code,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
