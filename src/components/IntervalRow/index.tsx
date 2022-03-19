import React from 'react';
import styles from './index.css';

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
  const diffTime = date2.getTime() - date1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export const IntervalRow = ({
  inRussia,
  dateStart,
  dateEnd,
}: Props) => {
  return (
    <div
      className={styles.row}
    >
      {inRussia ? 'in' : 'out'} {formatDatesInterval(dateStart, dateEnd)} ({calculateDays(dateStart, dateEnd)} days)
    </div>
  );
};
