import * as React from 'react';
import { CoordinateProps } from '../placeStateless/PlaceComponent';
const LatLongComponent = (props: CoordinateProps) => {
  return (
    <div className="container-fluid">
      <form className="form-horizontal">
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="coordinatType">
            Coordinate type/datum
          </label>
          <div className="col-md-2">
            <select
              className="form-control"
              id="coordinateType"
              disabled={props.readOnly}
              value={
                props.editingInputCoordinate &&
                props.editingInputCoordinate.coordinateType
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
          <div className="col-md-2">
            {props.editingInputCoordinate &&
              props.editingInputCoordinate.coordinateType === 'LAT/LONG' && (
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
              )}
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="coordinatString">
            Coordinate string{' '}
          </label>
          <div
            className={
              props.coordinateInvalid
                ? 'row form-group has-warning '
                : 'row form-group has-success  '
            }
          >
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                id="coordinatString"
                disabled={props.readOnly}
                onKeyPress={props.onCoordinateLatLonKeyPress}
                onChange={e => {
                  props.onChangeCoordinateText('coordinateString')(e.target.value);
                }}
                value={
                  props.editingInputCoordinate &&
                  props.editingInputCoordinate.coordinateString
                }
              />
            </div>
            {props.editingInputCoordinate &&
              props.editingInputCoordinate.coordinateString && (
                <button className="btn btn-default" onClick={props.toggleShowMap}>
                  {props.showMap ? 'Hide map' : 'Show map'}
                </button>
              )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default LatLongComponent;
