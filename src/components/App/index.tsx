import React from 'react';

const datesNotInRussia: [string, string][] = [
  ['2021-11-28', '2022-05-01'],
];

const intervalsToTimestamps = (intervals: [string, string][]): [number, number][] => {
  return intervals.map(([start, end]) => {
    const startDate = new Date(start);
    const endDate = end.length ? new Date(end) : new Date();
    return [
      startDate.getTime(),
      endDate.getTime(),
    ];
  });
};

const isTimeInIntervals = (time: number, intervals: [number, number][]): boolean => {
  return intervals.some(([start, end]) => time >= start && time <= end);
};

export const App = () => {
  const intervalsNotInRussia = intervalsToTimestamps(datesNotInRussia);
  const maxEndDate = intervalsNotInRussia.reduce((max, [_, end]) => Math.max(max, end), 0);

  let today = new Date();
  if (today.getTime() < maxEndDate) {
    today = new Date(maxEndDate);
  }
  today.setHours(0, 0, 0, 0);
  const minus12months = new Date(today.getFullYear(), today.getMonth() - 12, today.getDate() + 1);

  const todayTimestamp = today.getTime();
  const minus12monthsTimestamp = minus12months.getTime();
  console.log(todayTimestamp);
  console.log(minus12monthsTimestamp);

  const secondsInDay = 24 * 60 * 60 * 1000;

  const rows = [];
  for (let time = todayTimestamp; time >= minus12monthsTimestamp; time -= secondsInDay) {
    const inRussia = !isTimeInIntervals(time, intervalsNotInRussia);
    rows.push({ inRussia, time });
  }

  console.log(rows);
  return (<>
    <div>in russia: {rows.filter(({ inRussia }) => inRussia).length}</div>
    <div>out of russia: {rows.filter(({ inRussia }) => !inRussia).length}</div>

    {rows.map(({ inRussia, time }, index) => {
      return <div key={index}>
        {inRussia ? 'in' : 'out'} {new Date(time).toLocaleDateString()}
      </div>;
    })}
  </>);
};
