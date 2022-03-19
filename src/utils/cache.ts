import { Intervals } from '../types/interval';

const INTERVALS_CACHE_KEY = 'intervals';

export const getIntervalsCache = (): Intervals => {
  try {
    return JSON.parse(localStorage.getItem(INTERVALS_CACHE_KEY) || '[]');
  } catch (e) {
    return [];
  }
};

export const setIntervalsCache = (intervals: Intervals): void => {
  localStorage.setItem(INTERVALS_CACHE_KEY, JSON.stringify(intervals));
};
