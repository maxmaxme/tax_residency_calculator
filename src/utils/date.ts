export const isLeapYear = (year: number) => {
  if ((year & 3) != 0) return false;
  return ((year % 100) != 0 || (year % 400) == 0);
};
