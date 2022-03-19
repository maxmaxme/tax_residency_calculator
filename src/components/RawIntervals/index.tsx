import React, { ChangeEvent, useState } from 'react';
import { Intervals } from '../../types/interval';

export const RawIntervals = ({
  intervals,
  setIntervals,
}: {
  intervals: Intervals,
  setIntervals(newValue: Intervals): void,
}) => {
  const [open, setOpen] = useState(false);

  const onChangeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    try {
      setIntervals(JSON.parse(e.target.value));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(!open)}>
        {open ? 'Close' : 'RAW'}
      </button>
      {open && (
        <div>
          <textarea
            style={{ width: 300 }}
            onChange={onChangeValue}
            value={JSON.stringify(intervals)}
          />
        </div>
      )}
    </>
  );
};
