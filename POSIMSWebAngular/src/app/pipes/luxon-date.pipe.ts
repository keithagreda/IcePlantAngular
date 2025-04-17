import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'luxonDate'
})
export class LuxonDatePipe implements PipeTransform {
  transform(
    value: string | Date | DateTime | null | undefined,
    format: string = 'MMM d, y, h:mm a'
  ): string {
    if (!value) return '';

    let dt: DateTime;

    if (value instanceof DateTime) {
      dt = value;
    } else if (value instanceof Date) {
      dt = DateTime.fromJSDate(value);
    } else if (typeof value === 'string') {
      dt = DateTime.fromISO(value);
    } else {
      return '';
    }

    if (!dt.isValid) return '';

    return dt.toFormat(format);
  }
}
