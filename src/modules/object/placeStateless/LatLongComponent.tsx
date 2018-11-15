import * as React from 'react';
import { CoordinateProps } from '../placeStateless/PlaceComponent';
const LatLongComponent = (props: CoordinateProps) => {
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
              <option key={`optionRow_${1}`}>{'No data'}</option>
            )}
          </select>
        </div>
      </div>

      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="coordinateType">Coordinate type </label>
        </div>
        {props.editingInputCoordinate &&
          props.editingInputCoordinate.coordinateType === 'LAT/LONG' && (
            <div className="col-md-4">
              <label htmlFor="coordinateGeomertry">Coordinate geometry </label>
            </div>
          )}
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
                  <option key={`optionRow_${i}`}>{type_text}</option>
                )
              )
            ) : (
              <option key={`optionRow_${1}`}>{'No data'}</option>
            )}
          </select>
        </div>
        {props.editingInputCoordinate &&
          props.editingInputCoordinate.coordinateType === 'LAT/LONG' && (
            <div className="col-md-3">
              <select
                className="form-control"
                id="coordinateGeomertry"
                disabled={props.readOnly}
                onChange={e => {
                  props.onChangeCoordinateText('coordinateGeometry')(e.target.value);
                }}
              >
                value={props.editingInputCoordinate &&
                  props.editingInputCoordinate.coordinateGeometry
                // props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateGeomertry
                }
                {props.coordinatePredefined.coordinateGeometryTypes ? (
                  props.coordinatePredefined.coordinateGeometryTypes.map(
                    ({ geometry }: { geometry: string }, i: number) => (
                      <option key={`optionRow_${i}`}>{geometry}</option>
                    )
                  )
                ) : (
                  <option key={`optionRow_${1}`}>{'No data'}</option>
                )}
              </select>
            </div>
          )}
      </div>
      <div className="row form-group">
        <div className="col-md-4">
          <label htmlFor="latLongCoordinateString">Lat / Long-Coordinate </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            id="latLongCoordinateString"
            disabled={props.readOnly}
            onChange={e => {
              props.onChangeCoordinateText('coordinateString')(e.target.value);
            }}
            value={
              props.editingInputCoordinate &&
              props.editingInputCoordinate.coordinateString
              //props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateString || ''
            }
          />
        </div>
      </div>
    </div>
  );
};

export default LatLongComponent;
