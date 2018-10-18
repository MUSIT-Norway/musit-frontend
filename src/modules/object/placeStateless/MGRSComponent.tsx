import * as React from 'react';
import { CoordinateProps, coordinateTypes, datumValues } from './CollectionEvents';

const MGRSComponent = (props: CoordinateProps) => {
  return (
    <div>
      <div className="row form-group">
        <div className="col-md-1">
          <label htmlFor="datum">Datum </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <select
            className="form-control"
            value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).datum}
            id="datum"
            onChange={e => {
              props.onChangeCoordinateText('datum')(e.target.value);
            }}
          >
            {datumValues.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="coordinateType">Coordinate type </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <select
            className="form-control"
            id="coordinateType"
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateType
            }
            onChange={e => {
              props.onChangeCoordinateText('coordinateType')(e.target.value);
            }}
          >
            {coordinateTypes.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="zone">Zone </label>
        </div>
        <div className="col-md-2">
          <label htmlFor="mgrsBand">Band </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            id="zone"
            onChange={e => {
              props.onChangeCoordinateText('utmZone')(e.target.value);
            }}
            value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).utmZone}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            id="mgrsBand"
            onChange={e => {
              props.onChangeCoordinateText('mgrsBand')(e.target.value);
            }}
            value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).mgrsBand}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="MGRSCoordinateString">MGRS-Coordinate </label>
        </div>
      </div>
      <div
        className={
          props.coordinateInvalid
            ? 'row form-group has-warning '
            : 'row form-group has-success  '
        }
      >
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            id="MGRSCoordinateString"
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks)
                .coordinateString || ''
            }
            onChange={e => {
              const v = e.target.value.toUpperCase();
              props.onChangeCoordinateText('coordinateString')(v);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MGRSComponent;
