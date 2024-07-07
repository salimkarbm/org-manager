import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const resultErrors = [];
      errors.map((err) =>
        resultErrors.push({
          ['field']: err.property,
          ['message']: Object.values(err.constraints)[0],
        }),
      );

      return {
        errors: resultErrors,
      };
    }
    return object;
  }

  private toValidate(metatype: unknown): metatype is object {
    const types: (new () => object)[] = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype as new () => object);
  }
}
