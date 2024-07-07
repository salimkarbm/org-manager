import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(exception.status || 500).json({
      error: exception.message,
      message: exception.response?.message || 'Internal Server Error',
      statusCode: exception.status || 500,
    });
  }
}
