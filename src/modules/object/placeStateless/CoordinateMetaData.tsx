import * as React from 'react';
import { CheckBox } from '../components/CheckBox';
import { CoordinateProps } from './CollectingEvents';
import { coordinateSources } from './mockdata/data';

const CoordinateMetaData = (props: CoordinateProps) => {
  return (
    <div className="form-group">
      <div className="row">
        <div className="col-md-2">
          <label htmlFor="coordinateSource">Coordinate source </label>
        </div>
      </div>
      <div className="row">
        <div className="col-md-2">
          <select
            className="form-control"
            id="coordinateSource"
            defaultValue={coordinateSources[0]}
            onChange={e => {
              props.onChangeCoordinateText('coordinateSource')(e.target.value);
            }}
          >
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateSource
            }
            {coordinateSources.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <div className="checkbox" id="coordinateAddedLater">
            <CheckBox
              id={'checkBoxCoordinateAddedLater'}
              checked={
                props.getCurrentCoordinate(props.coordinateHistoryIndeks) &&
                props.getCurrentCoordinate(props.coordinateHistoryIndeks).isAddedLater
                  ? true
                  : false
              }
              displayValue="Added later"
              onChange={() => {
                props.getCurrentCoordinate(props.coordinateHistoryIndeks) &&
                props.getCurrentCoordinate(props.coordinateHistoryIndeks).isAddedLater
                  ? props.onChangeCheckBoxBoolean('isAddedLater')(false)
                  : props.onChangeCheckBoxBoolean('isAddedLater')(true);
              }}
            />
          </div>
        </div>
        {/* <div className="col-md-2">
          <div className="checkbox" id="caCoordinate">
            <CheckBox
              id={'checkBoxcCaCoordinate'}
              checked={
                props.getCurrentCoordinate(props.coordinateHistoryIndeks) &&
                props.getCurrentCoordinate(props.coordinateHistoryIndeks).caCoordinate
                  ? true
                  : false
              }
              displayValue="Ca Coordinate"
              onChange={() => {
                props.getCurrentCoordinate(props.coordinateHistoryIndeks) &&
                props.getCurrentCoordinate(props.coordinateHistoryIndeks).caCoordinate
                  ? props.onChangeCheckBoxBoolean('caCoordinate')(false)
                  : props.onChangeCheckBoxBoolean('caCoordinate')(true);
              }}
            />
          </div>
        </div> */}
      </div>
      <div className="row">
        <div className="col-md-2">
          <label htmlFor="precision">Precision</label>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <input
            className="form-control"
            type="text"
            onChange={e => {
              props.onChangeCoordinateText('coordinatePrecision')(e.target.value);
            }}
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks)
                .coordinatePrecision
            }
            id="precision"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-1">
          <label htmlFor="accuracy">Accuracy</label>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <input
            className="form-control"
            type="text"
            onChange={e => {
              props.onChangeCoordinateText('gpsAccuracy')(e.target.value);
            }}
            value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).gpsAccuracy}
            id="accuracy"
          />
        </div>
      </div>
    </div>
  );
};

export default CoordinateMetaData;
