import { Module } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { APP_FILTER } from '@nestjs/core';
import { ValidationFilter } from './validation.filter';

@Module({
  providers: [
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ValidationFilter,
    },
  ],
  exports: [ValidationService],
})
export class ValidationModule {}
