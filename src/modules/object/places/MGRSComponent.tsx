import * as React from 'react';
import {
  CoordinateProps,
  coordinateTypes,
  geometryTypes,
  datumValues
} from './PlaceComponent';

const MGRSComponent = (props: CoordinateProps) => {
  return (
    <div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="coordinateType">Coordinate type </label>
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
        {props.editingCoordinate &&
          props.editingCoordinate.coordinateType !== 'MGRS' && (
            <div className="col-md-3">
              <div>
                <label htmlFor="coordinateGeomertry">Coordinate geometry </label>
                <select
                  className="form-control"
                  id="coordinateGeomertry"
                  value={
                    props.getCurrentCoordinate(props.coordinateHistoryIndeks)
                      .coordinateGeomertry
                  }
                  onChange={e => {
                    props.onChangeCoordinateText('coordinateGeomertry')(e.target.value);
                  }}
                >
                  {geometryTypes.map((type: string, i: number) => (
                    <option key={`optionRow_${i}`}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
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
          <label htmlFor="mgrsBand">Band </label>
          <input
            type="text"
            className="form-control"
            id="mgrsBand"
            value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).mgrsBand}
          />
        </div>
      </div>
      <div
        className={
          props.coordinateInvalid
            ? 'row form-group has-warning '
            : 'row form-group has-success  '
        }
      >
        <div className="col-md-7">
          <label htmlFor="MGRSCoordinateString">MGRS-Coordinate </label>
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
