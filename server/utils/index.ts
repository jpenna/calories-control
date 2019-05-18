// Discard timezone from date
export function adjustTimezone(date: Date): Date {
  const aDate = new Date(date);
  const adjustedHours = aDate.getHours() - aDate.getTimezoneOffset() / 60;
  aDate.setHours(adjustedHours);
  return aDate;
}
