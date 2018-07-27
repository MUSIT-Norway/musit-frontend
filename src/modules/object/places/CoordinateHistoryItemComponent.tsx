import * as React from 'react';
import { CoordinateProps } from './PlaceComponent';

const CoordinateHistoryItemComponent = (props: CoordinateProps) => {
  return (
    <div>
      <div className="row">
        <div className="col-md-3">
          <label htmlFor="coordinateRevisionNote">Note on revision </label>
          <textarea
            className="form-control"
            value={props.getCurrentHistoryItem(props.coordinateHistoryIndeks).note}
            id="coordinateRevisionNote"
            onChange={e => {
              props.onChangeHistoryItem('note')(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CoordinateHistoryItemComponent;
