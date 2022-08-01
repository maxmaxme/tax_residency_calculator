import React from 'react';
import cn from 'classnames';
import styles from './index.css';

type Props = {
  inCountry: boolean;
  dateStart: Date,
  dateEnd: Date,
}

const formatDatesInterval = (date1: Date, date2: Date) => {
  if (date1.getTime() === date2.getTime()) {
    return date1.toLocaleDateString('ru-RU');
  }
  return (
    date1.toLocaleDateString('ru-RU') + ' - ' + date2.toLocaleDateString('ru-RU')
  );
};

const calculateDays = (date1: Date, date2: Date) => {
  const diffTime = date2.getTime() - date1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export const IntervalRow = ({
  inCountry,
  dateStart,
  dateEnd,
}: Props) => {
  const daysCount = calculateDays(dateStart, dateEnd);
  return (
    <div
      className={cn(styles.row, {
        [styles['row--in_country']]: inCountry,
      })}
    >
      {formatDatesInterval(dateStart, dateEnd)} ({daysCount} day{daysCount > 1 ? 's' : ''})
    </div>
  );
};
