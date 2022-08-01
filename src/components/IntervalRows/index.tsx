import { IntervalRow } from '../IntervalRow';
import React, { useMemo } from 'react';
import { GroupedRow, Row } from '../App';
import styles from './index.css';

const groupRows = (rows: Row[]): GroupedRow[] => {
  const groupedRows = [];
  let prevValue = undefined;
  for (let i = 0; i < rows.length; i++) {
    if (prevValue !== rows[i].inCountry) {
      groupedRows.push({
        inCountry: rows[i].inCountry,
        doyStart: rows[i].doy,
        doyEnd: rows[i].doy,
      });
      prevValue = rows[i].inCountry;
    } else {
      groupedRows[groupedRows.length - 1].doyEnd = rows[i].doy;
    }
  }

  return groupedRows;
};

export const IntervalRows = ({ rows, year }: { rows: Row[], year: number }) => {
  const groupedRows = useMemo(() => groupRows(rows), [rows]);

  return (
    <div className={styles.intervalRows}>
      {groupedRows.map(({ inCountry, doyStart, doyEnd }, index) => {
        return (
          <IntervalRow
            key={index}
            inCountry={inCountry}
            dateStart={new Date(year, 0, doyStart)}
            dateEnd={new Date(year, 0, doyEnd)}
          />
        );
      })}
    </div>
  );
};
