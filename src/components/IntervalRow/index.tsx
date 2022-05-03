import React from 'react';
import cn from 'classnames';
import styles from './index.css';

type Props = {
  inRussia: boolean;
  dateStart: Date,
  dateEnd: Date,
}

const formatDatesInterval = (date1: Date, date2: Date) => {
  return (
    date1.toLocaleDateString('ru-RU') + ' - ' + date2.toLocaleDateString('ru-RU')
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
      className={cn(styles.row, {
        [styles['row--in_russia']]: inRussia,
      })}
    >
      {formatDatesInterval(dateStart, dateEnd)} ({calculateDays(dateStart, dateEnd)} days)
    </div>
  );
};
