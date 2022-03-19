import React from 'react';
import { DatesInput } from '../DatesInput';
import { Interval } from '../../types/interval';
import { IntervalRows } from '../IntervalRows';

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

const isTimeInIntervals = (time: number, intervals: Interval[]): boolean => {
  return intervals.some(([start, end]) => time >= start && time <= end);
};

const calcDays = (intervals: Interval[]): Row[] => {
  let yearEnd = new Date();
  const maxEndDate = intervals.reduce((max, [_, end]) => Math.max(max, end), 0);
  if (yearEnd.getTime() < maxEndDate) {
    yearEnd = new Date(maxEndDate);
  }
  yearEnd.setHours(0, 0, 0, 0);
  const yearEndTimestamp = yearEnd.getTime();

  const yearStart = new Date(yearEnd.getFullYear(), yearEnd.getMonth() - 12, yearEnd.getDate() + 1);
  const yearStartTimestamp = yearStart.getTime();

  const rows = [];
  for (let time = yearStartTimestamp; time <= yearEndTimestamp; time += mSecondsInDay) {
    const inRussia = !isTimeInIntervals(time, intervals);
    rows.push({ inRussia, time });
  }

  return rows;
};

export const App = () => {
  const today = new Date();
  const todayTimestamp = today.getTime();

  const [intervalsNotInRussia, setIntervalsNotInRussia] = React.useState<Interval[]>([[1638057600000, todayTimestamp]]);
  const setIntervals = (intervals: Interval[]) => {
    // intervals = intervals.sort((a, b) => a[0] - b[0]);
    setIntervalsNotInRussia(intervals);
  };

  const rows = calcDays(intervalsNotInRussia);

  return (<>
    <DatesInput intervals={intervalsNotInRussia} setIntervals={setIntervals} />
    <div>in russia: {rows.filter(({ inRussia }) => inRussia).length}</div>
    <div>out of russia: {rows.filter(({ inRussia }) => !inRussia).length}</div>

    <IntervalRows rows={rows} />
  </>);
};
