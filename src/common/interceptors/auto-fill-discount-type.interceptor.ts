import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DiscountType } from 'src/database/entities';

@Injectable()
export class AutoFillDiscountTypeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;


    if (body.discountDaily && !body.discountDailyType) {
      body.discountDailyType = DiscountType.Percentage;
    }

    // Villa
    if (body.discountDaily && !body.discountDailyType) {
      body.discountDailyType = DiscountType.Percentage;
    }

    if (body.discountMonthly && !body.discountMonthlyType) {
      body.discountMonthlyType = DiscountType.Percentage;
    }

    if (body.discountYearly && !body.discountYearlyType) {
      body.discountYearlyType = DiscountType.Percentage;
    }

    return next.handle();
  }
}
