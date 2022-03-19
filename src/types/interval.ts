export type Interval = [number, number];

export type IntervalId = string;
export type IntervalMap = {
  [key: IntervalId]: Interval;
};
