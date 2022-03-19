import { Interval } from '../types/interval';

const INTERVALS_CACHE_KEY = 'intervals';

export const getIntervalsCache = (): Interval[] => {
  try {
    return JSON.parse(localStorage.getItem(INTERVALS_CACHE_KEY) || '[]');
  } catch (e) {
    return [];
  }
};

export const setIntervalsCache = (intervals: Interval[]): void => {
  intervals = intervals.sort((a, b) => a[0] - b[0]);
  localStorage.setItem(INTERVALS_CACHE_KEY, JSON.stringify(intervals));
};
