import { ViewColumn, ViewEntity } from 'typeorm';
import { BaseActivity } from '../index';

@ViewEntity({
  name: 'activities_view',
  expression: `
    SELECT
        a.*,
        COALESCE(tb.total_today_booking, 0) AS total_today_booking
    FROM
        activities a
    LEFT JOIN (
        SELECT
            b.activity_id,
            COUNT(*) AS total_today_booking
        FROM
            bookings b
        WHERE
            b.status = 'completed'
            AND b.booking_date >= date_trunc('day', now())
            AND b.booking_date < date_trunc('day', now()) + interval '1 day'
        GROUP BY
            b.activity_id
    ) tb
    ON tb.activity_id = a.id;
  `,
})
export class ActivityView extends BaseActivity {
  @ViewColumn({ name: 'total_today_booking' })
  totalTodayBooking!: number | null;
}
