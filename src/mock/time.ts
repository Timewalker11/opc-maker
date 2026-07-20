const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function minutesAgo(n: number): string {
  return new Date(Date.now() - n * MINUTE).toISOString();
}

export function hoursAgo(n: number): string {
  return new Date(Date.now() - n * HOUR).toISOString();
}

export function daysAgo(n: number): string {
  return new Date(Date.now() - n * DAY).toISOString();
}

export function hoursFromNow(n: number): string {
  return new Date(Date.now() + n * HOUR).toISOString();
}

export function daysFromNow(n: number): string {
  return new Date(Date.now() + n * DAY).toISOString();
}

export function todayAt(hour: number, minute = 0): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}
