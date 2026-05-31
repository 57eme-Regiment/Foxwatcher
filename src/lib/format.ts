import { format } from 'date-fns';

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), 'yyyy/MM/dd, hh:mm:ss aa');
}
