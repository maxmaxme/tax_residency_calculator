import React, { useMemo, useState } from 'react';
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

const calcDays = (intervals: Intervals, year: number): Row[] => {
  const yearEnd = convertToUtc(new Date(year, 11, 31));
  const yearStart = convertToUtc(new Date(year, 0, 1));

  yearStart.setHours(0, 0, 0, 0);
  yearEnd.setHours(0, 0, 0, 0);

  const yearEndTimestamp = yearEnd.getTime();
  const yearStartTimestamp = yearStart.getTime();

  const rows = [];
  for (let time = yearStartTimestamp; time <= yearEndTimestamp; time += mSecondsInDay) {
    const inRussia = !isTimeInIntervals(time, intervals);
    rows.push({ inRussia, time });
  }

  return rows;
};

export const App = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [intervalsNotInRussia, setIntervalsNotInRussia] = useState<Intervals>(getIntervalsCache());
  const setIntervals = (intervals: Intervals) => {
    intervals = intervals.sort((a, b) => a.start - b.start);
    setIntervalsCache(intervals);
    setIntervalsNotInRussia(intervals);
  };

  const rows = useMemo(() => calcDays(intervalsNotInRussia, year), [intervalsNotInRussia, year]);
  const yearsForSelect = useMemo(() => {
    const years = [];
    const count = 7;
    const startFrom = Math.ceil(new Date().getFullYear() - count / 2);
    for (let i = 0; i < count; i++) {
      years.push(startFrom + i);
    }
    return years;
  }, []);

  return (<>
    <div>
      Year&nbsp;
      <select
        onChange={({ target: { value } }) => setYear(Number(value))}
        value={year}
      >
        {yearsForSelect.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </div>
    <DatesInput intervals={intervalsNotInRussia} setIntervals={setIntervals} />
    <div className={cn(styles.summary_row, styles['summary_row--inside'])}>in russia: {rows.filter(({ inRussia }) => inRussia).length}</div>
    <div className={cn(styles.summary_row, styles['summary_row--outside'])}>not in russia: {rows.filter(({ inRussia }) => !inRussia).length}</div>

    <IntervalRows rows={rows} />
  </>);
};
