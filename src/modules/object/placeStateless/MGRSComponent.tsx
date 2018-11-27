import * as React from 'react';
import { CoordinateProps } from '../placeStateless/PlaceComponent';

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
            disabled={props.readOnly}
            onChange={e => {
              props.onChangeCoordinateText('datum')(e.target.value);
            }}
          >
            {props.coordinatePredefined.coordinatDatumTypes ? (
              props.coordinatePredefined.coordinatDatumTypes.map(
                ({ datum }: { datum: string }, i: number) => (
                  <option key={`optionRow_${i}`}>{datum}</option>
                )
              )
            ) : (
              <option key={`optionRow_${1}`}>{'No datum'}</option>
            )}
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
            disabled={props.readOnly}
            value={
              props.editingInputCoordinate && props.editingInputCoordinate.coordinateType
              //props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateType
            }
            onChange={e => {
              props.onChangeCoordinateText('coordinateType')(e.target.value);
            }}
          >
            {props.coordinatePredefined.coordinateTypes ? (
              props.coordinatePredefined.coordinateTypes.map(
                ({ type_text }: { type_text: string }, i: number) => (
                  <option key={`optionRow_${i}`} value={type_text}>
                    {type_text}
                  </option>
                )
              )
            ) : (
              <option key={`optionRow_${1}`}>{'No data'}</option>
            )}
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            id="zone"
            disabled={props.readOnly}
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
            disabled={props.readOnly}
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
            onKeyPress={props.onCoordinateMGRSKeyPress}
            className="form-control"
            id="MGRSCoordinateString"
            disabled={props.readOnly}
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
