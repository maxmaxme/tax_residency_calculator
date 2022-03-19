import React, { ChangeEvent } from 'react';
import { IntervalId, IntervalMap } from '../../types/interval';
import { convertToUtc } from '../../utils/timezone';

type Props = {
  intervals: IntervalMap,
  setIntervals(intervals: IntervalMap): void,
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
    start.setHours(0, 0, 0, 0);
    onChange(start, end);
  };

  const onEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const end = new Date(e.target.value);
    end.setHours(0, 0, 0, 0);
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
  intervals: IntervalMap,
  setIntervals(intervals: IntervalMap): void,
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = convertToUtc(today).getTime();

  const onChange = (id: IntervalId) => (start?: Date, end?: Date) => {
    if (!start) return;
    const newIntervals = { ...intervals };
    newIntervals[id] = [convertToUtc(start)?.getTime(), end ? convertToUtc(end).getTime() : todayTimestamp];
    setIntervals(newIntervals);
  };

  const removeInterval = (id: IntervalId) => () => {
    const newIntervals = { ...intervals };
    delete newIntervals[id];
    setIntervals(newIntervals);
  };

  return (<>
    <RawIntervals intervals={intervals} setIntervals={setIntervals} />
    {Object.keys(intervals).map((id) => {
      const [start, end] = intervals[id];
      return (
        <IntervalInput
          key={id}
          start={new Date(start)}
          end={new Date(end)}
          onChange={onChange(id)}
          removeInterval={removeInterval(id)}
        />
      );
    })}
    <button onClick={() => {
      const newInterval = [todayTimestamp, todayTimestamp];
      setIntervals({ ...intervals, [Object.values(intervals).length]: newInterval });
    }}>+</button>
  </>);
};
