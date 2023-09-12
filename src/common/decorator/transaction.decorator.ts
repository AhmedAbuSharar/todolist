import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const TransactionParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.transaction;
  },
);
