export const browserTZ = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

export const fmtUTC = (
  date: Date | string,
  tz: string,
  pattern = 'dd MMM yyyy HH:mm'
) =>
  require('date-fns-tz').formatInTimeZone(
    new Date(date),
    tz,
    pattern
  );