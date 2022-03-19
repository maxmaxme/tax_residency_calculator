import React, { ChangeEvent } from 'react';
import { Interval, IntervalId, Intervals } from '../../types/interval';
import { convertToUtc } from '../../utils/timezone';
import DatePickerComponent from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Props = {
  intervals: Intervals,
  setIntervals(intervals: Intervals): void,
}

type IntervalInputProps = {
  start?: Date,
  end?: Date,
  onChange(start?: Date, end?: Date): void,
  removeInterval(): void,
}

const DatePicker = (props: {
  selected?: Date,
  onChange(date: Date | null): void
}) => {
  return (
    <div>
      <DatePickerComponent
        dateFormat="dd.MM.yyyy"
        {...props}
      />
    </div>
  );
};

const IntervalInput = ({
  start,
  end,
  onChange,
  removeInterval,
}: IntervalInputProps) => {
  const onStartChange = (startValue: Date | null) => {
    if (!startValue) return;
    startValue.setHours(0, 0, 0, 0);
    onChange(startValue, end);
  };

  const onEndChange = (endValue: Date | null) => {
    if (!endValue) return;
    endValue.setHours(0, 0, 0, 0);
    onChange(start, endValue);
  };

  return (
    <div style={{ display: 'flex' }}>
      <DatePicker selected={start} onChange={(date) => onStartChange(date)} />
      <DatePicker selected={end} onChange={(date) => onEndChange(date)} />
      <button onClick={removeInterval}>×</button>
    </div>
  );
};

const RawIntervals = ({
  intervals,
  setIntervals,
}: {
  intervals: Intervals,
  setIntervals(newValue: Intervals): void,
}) => {
  const onChangeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    try {
      setIntervals(JSON.parse(e.target.value));
    } catch (error) {
      console.error(error);
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
    const newIntervals = [...intervals];
    const index = newIntervals.findIndex((i) => i.id === id);
    newIntervals[index] = {
      id: newIntervals[index].id,
      start: convertToUtc(start).getTime(),
      end: end ? convertToUtc(end).getTime() : todayTimestamp,
    };
    setIntervals(newIntervals);
  };

  const removeInterval = (id: IntervalId) => () => {
    setIntervals(intervals.filter((i) => i.id !== id));
  };

  return (<>
    <RawIntervals intervals={intervals} setIntervals={setIntervals} />
    {intervals.map(({ id, start, end }) => {
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
      const newInterval: Interval = {
        id: String(intervals.length),
        start: todayTimestamp,
        end: todayTimestamp,
      };
      setIntervals([...intervals, newInterval]);
    }}>+</button>
  </>);
};
