import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SEQUELIZE } from '../constants';
import { Sequelize, Transaction } from 'sequelize';
import { CustomLogger } from '../logger/logger.service';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    @Inject(SEQUELIZE)
    private readonly sequelizeInstance: Sequelize,
    private customLogger: CustomLogger,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    this.customLogger.log('transaction');
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const transaction: Transaction = await this.sequelizeInstance.transaction();
    req.transaction = transaction;

    return next.handle().pipe(
      tap(() => {
        transaction.commit();
      }),
      catchError((error) => {
        transaction.rollback();
        this.customLogger.error(error)
        return throwError(error);
      }),
    );
  }
}
