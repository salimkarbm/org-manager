import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { OkResponse } from '../utils/base.controller';

interface ClassConstructor {
  new (...args: any[]): Record<string, unknown>;
}
export class SerializeInterceptor implements NestInterceptor {
  constructor(
    private message: string,
    private dto: ClassConstructor,
  ) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    /*
        Run something before a request is handled by an request handler
    */
    return next.handle().pipe(
      map((data: any) => {
        /*
            Run something before response is sent out
        */
        const transformedData = plainToInstance(this.dto, data.data || data, {
          excludeExtraneousValues: true,
        });
        return new OkResponse(
          this.message,
          transformedData.data || transformedData,
        );
      }),
    );
  }
}

export function Serialize(message: string, dto: any) {
  return UseInterceptors(new SerializeInterceptor(message, dto));
}
