import * as React from 'react';
import { CoordinateProps } from '../placeStateless/PlaceComponent';
import { coordinateTypes, datumValues } from './mockdata/data';

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
            value={
              props.editingInputCoordinate && props.editingInputCoordinate.datum
              //props.getCurrentCoordinate(props.coordinateHistoryIndeks).datum
            }
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
        <div className="col-md-2">
          <label htmlFor="zone">Zone </label>
        </div>
        <div className="col-md-2">
          <label htmlFor="mgrsBand">Bend </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <select
            className="form-control"
            id="coordinateType"
            value={
              props.editingInputCoordinate && props.editingInputCoordinate.coordinateType
              //props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateType
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
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            id="zone"
            onChange={e => {
              props.onChangeCoordinateText('zone')(e.target.value);
            }}
            value={
              props.editingInputCoordinate && props.editingInputCoordinate.zone
              // props.getCurrentCoordinate(props.coordinateHistoryIndeks).utmZone
            }
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            id="mgrsBand"
            onChange={e => {
              props.onChangeCoordinateText('bend')(e.target.value);
            }}
            value={
              props.editingInputCoordinate && props.editingInputCoordinate.bend
              //props.getCurrentCoordinate(props.coordinateHistoryIndeks).mgrsBand
            }
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
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            id="MGRSCoordinateString"
            value={
              props.editingInputCoordinate &&
              props.editingInputCoordinate.coordinateString
              //props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateString
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
