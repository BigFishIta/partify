import {
  Catch, ArgumentsHost, ExceptionFilter, HttpException, HttpStatus,
} from '@nestjs/common';

@Catch()                       // intercetta *tutte* le eccezioni
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const payload = {
      timestamp: new Date().toISOString(),
      path:      req.url,
      status,
      message:
        exception instanceof HttpException
          ? exception.getResponse()
          : 'Internal server error',
    };

    // log solo le 500
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      // eslint-disable-next-line no-console
      console.error(exception);
    }

    res.status(status).json(payload);
  }
}