import React, { useMemo, useState } from 'react';
import { DatesInput } from '../DatesInput';
import { Intervals } from '../../types/interval';
import { IntervalRows } from '../IntervalRows';
import { getIntervalsCache, setIntervalsCache } from '../../utils/cache';
import cn from 'classnames';
import styles from './index.css';
import { isLeapYear } from '../../utils/date';

export type Row = {
  inCountry: boolean,
  doy: number,
}

export type GroupedRow = {
  inCountry: boolean,
  doyStart: number,
  doyEnd: number,
}

const isTimeInIntervals = (time: number, intervals: Intervals): boolean => {
  return Object.values(intervals).some(({ start, end }) => time > start && time < end); // exclude start and end
};

const calcDays = (intervals: Intervals, year: number): Row[] => {
  const daysInYear = isLeapYear(year) ? 366 : 365;
  const rows = [];
  for (let doy = 1; doy < daysInYear; doy++) {
    const inCountry = !isTimeInIntervals(new Date(year, 0, doy).getTime(), intervals);
    rows.push({ inCountry, doy: doy });
  }
  return rows;
};

export const App = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [intervalsNotinCountry, setIntervalsNotinCountry] = useState<Intervals>(getIntervalsCache());
  const setIntervals = (intervals: Intervals) => {
    intervals = intervals.sort((a, b) => a.start - b.start);
    setIntervalsCache(intervals);
    setIntervalsNotinCountry(intervals);
  };

  const rows = useMemo(() => calcDays(intervalsNotinCountry, year), [intervalsNotinCountry, year]);
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
    <DatesInput intervals={intervalsNotinCountry} setIntervals={setIntervals} />
    <div className={cn(styles.summary_row, styles['summary_row--inside'])}>in country: {rows.filter(({ inCountry }) => inCountry).length}</div>
    <div className={cn(styles.summary_row, styles['summary_row--outside'])}>not in country: {rows.filter(({ inCountry }) => !inCountry).length}</div>

    <IntervalRows rows={rows} year={year} />
  </>);
};
