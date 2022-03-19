import React, { useMemo } from 'react';
import { DatesInput } from '../DatesInput';
import { Intervals } from '../../types/interval';
import { IntervalRows } from '../IntervalRows';
import { getIntervalsCache, setIntervalsCache } from '../../utils/cache';
import { convertToUtc } from '../../utils/timezone';
import cn from 'classnames';
import styles from './index.css';

export type Row = {
  inRussia: boolean,
  time: number,
}

export type GroupedRow = {
  inRussia: boolean,
  timeStart: number,
  timeEnd: number,
}

const mSecondsInDay = 24 * 60 * 60 * 1000;

const isTimeInIntervals = (time: number, intervals: Intervals): boolean => {
  return Object.values(intervals).some(({ start, end }) => time >= start && time <= end);
};

const calcDays = (intervals: Intervals): Row[] => {
  let yearEnd = new Date();

  const maxEndDate = Object.values(intervals).reduce((max, { end }) => Math.max(max, end), 0);
  if (yearEnd.getTime() < maxEndDate) {
    yearEnd = new Date(maxEndDate);
  }
  yearEnd.setHours(0, 0, 0, 0);
  yearEnd = convertToUtc(yearEnd);
  const yearEndTimestamp = yearEnd.getTime();

  let yearStart = new Date(yearEnd.getFullYear(), yearEnd.getMonth() - 12, yearEnd.getDate() + 1);
  yearStart = convertToUtc(yearStart);

  const yearStartTimestamp = yearStart.getTime();

  const rows = [];
  for (let time = yearStartTimestamp; time <= yearEndTimestamp; time += mSecondsInDay) {
    const inRussia = !isTimeInIntervals(time, intervals);
    rows.push({ inRussia, time });
  }

  return rows;
};

export const App = () => {
  const [intervalsNotInRussia, setIntervalsNotInRussia] = React.useState<Intervals>(getIntervalsCache());
  const setIntervals = (intervals: Intervals) => {
    intervals = intervals.sort((a, b) => a.start - b.start);
    setIntervalsCache(intervals);
    setIntervalsNotInRussia(intervals);
  };

  const rows = useMemo(() => calcDays(intervalsNotInRussia), [intervalsNotInRussia]);

  return (<>
    <DatesInput intervals={intervalsNotInRussia} setIntervals={setIntervals} />
    <div className={cn(styles.summary_row, styles['summary_row--inside'])}>in russia: {rows.filter(({ inRussia }) => inRussia).length}</div>
    <div className={cn(styles.summary_row, styles['summary_row--outside'])}>not in russia: {rows.filter(({ inRussia }) => !inRussia).length}</div>

    <IntervalRows rows={rows} />
  </>);
};
