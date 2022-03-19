import React, { ChangeEvent } from 'react';
import { Interval } from '../../types/interval';

type Props = {
  intervals: Interval[],
  setIntervals(intervals: Interval[]): void,
}

type IntervalInputProps = {
  start?: Date,
  end?: Date,
  onChange(start?: Date, end?: Date): void,
  removeInterval(): void,
}

const IntervalInput = ({
  start,
  end,
  onChange,
  removeInterval,
}: IntervalInputProps) => {
  const toInput = (date?: Date) => {
    if (!date) return '';

    return date.getFullYear().toString().padStart(4, '0') +
      '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getDate().toString().padStart(2, '0');
  };

  const onStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const start = new Date(e.target.value);
    onChange(start, end);
  };

  const onEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const end = new Date(e.target.value);
    onChange(start, end);
  };

  return (
    <div>
      <input type="date" value={toInput(start)} onChange={onStartChange} />
      <input type="date" value={toInput(end)} onChange={onEndChange} />
      <button onClick={removeInterval}>×</button>
    </div>
  );
};

const RawIntervals = ({
  intervals,
  setIntervals,
}: {
  intervals: Interval[],
  setIntervals(intervals: Interval[]): void,
}) => {
  const onChangeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const intervals = JSON.parse(e.target.value);
      setIntervals(intervals);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <textarea
      style={{ width: 300 }}
      onChange={onChangeValue}
      value={JSON.stringify(intervals)}
    />
  );
};

export const DatesInput = ({
  intervals,
  setIntervals,
}: Props) => {
  const todayTimestamp = new Date().getTime();

  const onChange = (index: number) => (start?: Date, end?: Date) => {
    const newIntervals = [...intervals];
    if (!start) return;
    newIntervals[index] = [start?.getTime(), end?.getTime() || todayTimestamp];
    setIntervals(newIntervals);
  };

  const removeInterval = (index: number) => () => {
    const newIntervals = [...intervals];
    newIntervals.splice(index, 1);
    setIntervals(newIntervals);
  };

  return (<>
    <RawIntervals intervals={intervals} setIntervals={setIntervals} />
    {intervals.map(([start, end], index) => {
      return (
        <IntervalInput
          key={index}
          start={new Date(start)}
          end={new Date(end)}
          onChange={onChange(index)}
          removeInterval={removeInterval(index)}
        />
      );
    })}
    <button onClick={() => setIntervals([...intervals, [todayTimestamp, todayTimestamp]])}>+</button>
  </>);
};
