import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CustomLogger } from '../logger/logger.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private customLogger: CustomLogger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let statusCode = 500;
    let errorMessage = 'Internal server error';

    if (exception instanceof Error) {
      errorMessage = exception.message;

      if (exception instanceof BadRequestException) {
        statusCode = 400;
      } else if (exception instanceof UnauthorizedException) {
        statusCode = 401;
      } else if (exception instanceof NotFoundException) {
        statusCode = 404;
      }

      this.customLogger.error(errorMessage);
    }

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
    });
  }
}
