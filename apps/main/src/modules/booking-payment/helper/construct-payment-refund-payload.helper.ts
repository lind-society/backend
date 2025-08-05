import { BookingPaymentRefundStatus } from '@apps/main/database/entities';
import { BadRequestException } from '@nestjs/common';
import { CreatePaymentRefundDto } from '../../payment/dto/refund';
import {
  PaymentAvailableCurrency,
  PaymentAvailableRefundStatus,
} from '../../payment/enum';
import { BookingPaymentWithRelationsDto } from '../dto';

export function constructPaymentRefundPayload(
  payload: CreatePaymentRefundDto,
  bookingPaymentDetail: BookingPaymentWithRelationsDto,
): CreatePaymentRefundDto {
  return {
    paymentRequestId: bookingPaymentDetail.paymentRequestReferenceId,
    referenceId: bookingPaymentDetail.id,
    currency: PaymentAvailableCurrency.IDR,
    amount: payload.amount,
    reason: payload.reason,
    metadata: payload.metadata,
  };
}

export function mapPaymentRefundStatus(
  status: PaymentAvailableRefundStatus,
): BookingPaymentRefundStatus {
  switch (status) {
    case PaymentAvailableRefundStatus.Succeeded:
      return BookingPaymentRefundStatus.Succeeded;

    case PaymentAvailableRefundStatus.Failed:
      return BookingPaymentRefundStatus.Failed;

    case PaymentAvailableRefundStatus.Pending:
      return BookingPaymentRefundStatus.Pending;

    case PaymentAvailableRefundStatus.Cancelled:
      return BookingPaymentRefundStatus.Cancelled;

    default:
      throw new BadRequestException('invalid payment refund status');
  }
}
