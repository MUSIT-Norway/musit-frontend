import * as React from 'react';
import {
  CoordinateProps,
  coordinateTypes,
  geometryTypes,
  datumValues
} from './PlaceComponent';

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
        {props.editingCoordinate &&
          props.editingCoordinate.coordinateType === 'Lat / Long' && (
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
        {props.editingCoordinate &&
          props.editingCoordinate.coordinateType === 'Lat / Long' && (
            <div className="col-md-3">
              <select
                className="form-control"
                id="coordinateGeomertry"
                onChange={e => {
                  props.onChangeCoordinateText('coordinateGeomertry')(e.target.value);
                }}
              >
                value={
                  props.getCurrentCoordinate(props.coordinateHistoryIndeks)
                    .coordinateGeomertry
                }
                {geometryTypes.map((type: string, i: number) => (
                  <option key={`optionRow_${i}`}>{type}</option>
                ))}
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
            onChange={e => {
              props.onChangeCoordinateText('coordinateString')(e.target.value);
            }}
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks)
                .coordinateString || ''
            }
          />
        </div>
      </div>
    </div>
  );
};

export default LatLongComponent;