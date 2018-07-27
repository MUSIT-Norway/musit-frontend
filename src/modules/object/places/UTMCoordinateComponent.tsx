import * as React from 'react';
import {
  CoordinateProps,
  coordinateTypes,
  geometryTypes,
  datumValues
} from './PlaceComponent';

const UTMCoordinateComponent = (props: CoordinateProps) => {
  return (
    <div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="coordinateType">Coordinate type </label>
          <select
            className="form-control"
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateType
            }
            id="coordinateType"
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
          <label htmlFor="datum">Datum </label>
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
        <div className="col-md-3">
          <label htmlFor="coordinateGeomertry">Coordinate geometry </label>
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
        <div className="col-md-2">
          <label htmlFor="zone">Zone </label>
          <input
            type="text"
            className="form-control"
            id="zone"
            value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).utmZone}
          />
        </div>
        <div className="col-md-2">
          <label htmlFor="utmBand">Band </label>
          <input
            type="text"
            className="form-control"
            id="utmBand"
            value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).mgrsBand}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-7">
          <label htmlFor="UTMCoordinateString">UTM-Coordinate </label>
          <input
            type="text"
            className="form-control"
            id="UTMCoordinateString"
            onChange={e => {
              props.onChangeCoordinateText('coordinateString')(e.target.value);
            }}
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateString
            }
          />
        </div>
      </div>
    </div>
  );
};

export default UTMCoordinateComponent;
