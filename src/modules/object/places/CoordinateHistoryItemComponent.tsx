import * as React from 'react';
import { CoordinateProps } from './PlaceComponent';

const CoordinateHistoryItemComponent = (props: CoordinateProps) => {
  return (
    <div className="form-group">
      <div className="row">
        <div className="col-md-2">
          <label htmlFor="coordinateRevisionNote">Note on revision </label>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <textarea
            rows={10}
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
