import * as React from 'react';
import { CheckBox } from '../components/CheckBox';
import { CoordinateProps, altDepthUnits } from './PlaceComponent';

const AltitudeDepthData = (props: CoordinateProps) => (
  <div>
    <div className="row">
      <div className="col-md-3 form-group">
        <label htmlFor="altitude">Altitude</label>
        <input
          className="form-control"
          type="text"
          onChange={e => {
            props.onChangeCoordinateText('altitudeAggregated')(e.target.value);
          }}
          value={
            props.getCurrentCoordinate(props.coordinateHistoryIndeks).altitudeAggregated
          }
          id="altitude"
        />
      </div>
      <div className="col-md-2 form-group">
        <label htmlFor="altitudeUnit">Unit </label>
        <select
          className="form-control"
          id="altitudeUnit"
          value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).altitudeUnit}
          onChange={e => {
            props.onChangeCoordinateText('altitudeUnit')(e.target.value);
          }}
        >
          {altDepthUnits.map((type: string, i: number) => (
            <option key={`optionRow_${i}`}>{type}</option>
          ))}
        </select>
      </div>
      <div className="col-md-3 form-group">
        <label htmlFor="depth">Depth</label>
        <input
          className="form-control"
          type="text"
          onChange={e => {
            props.onChangeCoordinateText('depthAggregated')(e.target.value);
          }}
          value={
            props.getCurrentCoordinate(props.coordinateHistoryIndeks).depthAggregated
          }
          id="depthLow"
        />
      </div>
      <div className="col-md-2 form-group">
        <label htmlFor="depthUnit">Unit </label>
        <select
          className="form-control"
          id="depthUnit"
          value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).depthUnit}
          onChange={e => {
            props.onChangeCoordinateText('depthUnit')(e.target.value);
          }}
        >
          {altDepthUnits.map((type: string, i: number) => (
            <option key={`optionRow_${i}`}>{type}</option>
          ))}
        </select>
      </div>
      <div className="col-md-1 form-group">
        <div className="checkbox" id="caAltitude">
          <CheckBox
            id={'checkBoxCaAltitude'}
            checked={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks) &&
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).caAltitude
                ? true
                : false
            }
            displayValue="Ca altitude"
            onChange={() => {
              props.getCurrentCoordinate(props.coordinateHistoryIndeks) &&
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).caAltitude
                ? props.onChangeCheckBoxBoolean('caAltitude')(false)
                : props.onChangeCheckBoxBoolean('caAltitude')(true);
            }}
          />
        </div>
        <div className="checkbox" id="caDepth">
          <CheckBox
            id={'checkBoxCaDepth'}
            checked={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks) &&
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).caDepth
                ? true
                : false
            }
            displayValue="Ca depth"
            onChange={() => {
              props.getCurrentCoordinate(props.coordinateHistoryIndeks) &&
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).caDepth
                ? props.onChangeCheckBoxBoolean('caDepth')(false)
                : props.onChangeCheckBoxBoolean('caDepth')(true);
            }}
          />
        </div>
      </div>
      <div className="col-md-4">
        <label htmlFor="note">Note</label>
        <textarea
          className="form-control"
          onChange={e => {
            props.onChangeCoordinateText('coordinateNote')(e.target.value);
          }}
          value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateNote}
          id="note"
        />
      </div>
    </div>
  </div>
);

export default AltitudeDepthData;
