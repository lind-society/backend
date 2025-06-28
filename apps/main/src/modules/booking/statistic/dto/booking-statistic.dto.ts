export class TotalBookingDto {
  readonly date?: string | null;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
  readonly total!: number;
}
