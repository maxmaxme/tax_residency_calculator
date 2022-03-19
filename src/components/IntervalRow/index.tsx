import React from 'react';

type Props = {
  inRussia: boolean;
  dateStart: Date,
  dateEnd: Date,
}

const formatDatesInterval = (date1: Date, date2: Date) => {
  return (
    date1.toLocaleDateString() + ' - ' + date2.toLocaleDateString()
  );
};

const calculateDays = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const IntervalRow = ({
  inRussia,
  dateStart,
  dateEnd,
}: Props) => {
  return (
    <div
    >
      {inRussia ? 'in' : 'out'} {formatDatesInterval(dateStart, dateEnd)} ({calculateDays(dateStart, dateEnd)} days)
    </div>
  );
};
