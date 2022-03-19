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

export const IntervalRow = ({
  inRussia,
  dateStart,
  dateEnd,
}: Props) => {
  return (
    <div
    >
      {inRussia ? 'in' : 'out'} {formatDatesInterval(dateStart, dateEnd)}
    </div>
  );
};
