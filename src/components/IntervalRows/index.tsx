import { IntervalRow } from '../IntervalRow';
import React, { useMemo } from 'react';
import { GroupedRow, Row } from '../App';
import styles from './index.css';

const groupRows = (rows: Row[]): GroupedRow[] => {
  const groupedRows = [];
  let groupStart = rows[0].time;
  let groupEnd = rows[0].time;
  let groupInRussia = false;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.inRussia !== groupInRussia) {
      if (groupStart !== groupEnd) {
        groupedRows.push({
          inRussia: groupInRussia,
          timeStart: groupStart,
          timeEnd: groupEnd,
        });
      }
      groupStart = row.time;
      groupEnd = row.time;
      groupInRussia = row.inRussia;
    } else {
      groupEnd = row.time;
    }
  }
  groupedRows.push({
    inRussia: groupInRussia,
    timeStart: groupStart,
    timeEnd: groupEnd,
  });
  return groupedRows;
};

export const IntervalRows = ({ rows }: { rows: Row[] }) => {
  const groupedRows = useMemo(() => groupRows(rows), [rows]);

  return (
    <div className={styles.intervalRows}>
      {groupedRows.map(({ inRussia, timeStart, timeEnd }, index) => {
        return (
          <IntervalRow
            key={index}
            inRussia={inRussia}
            dateStart={new Date(timeStart)}
            dateEnd={new Date(timeEnd)}
          />
        );
      })}
    </div>
  );
};
