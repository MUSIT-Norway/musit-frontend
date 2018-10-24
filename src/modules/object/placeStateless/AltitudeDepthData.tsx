import * as React from 'react';
import { CheckBox } from '../components/CheckBox';
import { CoordinateProps } from './CollectionEvents';
import { altDepthUnits } from './mockdata/data';

const AltitudeDepthData = (props: CoordinateProps) => (
  <div className="form-group">
    <div className="row">
      <div className="col-md-2">
        <label htmlFor="altitude">Altitude</label>
      </div>
      <div className="col-md-2">
        <label />
      </div>
      <div className="col-md-2">
        <label htmlFor="altitudeUnit">Unit </label>
      </div>
    </div>
    <div className="row">
      {/* <div className="col-md-2">
        <input
          className="form-control"
          type="text"
          onChange={e => {
            props.onChangeAltitudeString(e.target.value);
          }}
          value={
            props.getCurrentCoordinate(props.coordinateHistoryIndeks).altitudeAggregated
          }
          id="altitude"
        />
      </div> */}
      <div className="col-md-2">
        <input
          placeholder="Low"
          className="form-control"
          type="number"
          onChange={e => {
            props.onChangeCoordinateNumber('altitudeLow')(parseFloat(e.target.value));
          }}
          value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).altitudeLow}
          id="altitudeLow"
        />
      </div>

      <div className="col-md-2">
        <input
          placeholder="High"
          className="form-control"
          type="number"
          onChange={e => {
            props.onChangeCoordinateNumber('altitudeHigh')(parseFloat(e.target.value));
          }}
          value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).altitudeHigh}
          id="altitudeHigh"
        />
      </div>

      <div className="col-md-2">
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
      <div className="col-md-2">
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
      </div>
    </div>

    <div className="row">
      <div className="col-md-2">
        <label htmlFor="depthAggregated">Depth</label>
      </div>
      <div className="col-md-2">
        <label htmlFor="depthUnit" />
      </div>
      <div className="col-md-1">
        <label htmlFor="depthUnit">Unit </label>
      </div>
    </div>
    <div className="row">
      {/* <div className="col-md-2">
        <input
          className="form-control"
          type="text"
          onChange={e => {
            props.onChangeDepthString(e.target.value);
          }}
          value={
            props.getCurrentCoordinate(props.coordinateHistoryIndeks).depthAggregated
          }
          id="depthAggregated"
        />
      </div> */}
      <div className="col-md-2">
        <input
          placeholder="Low"
          className="form-control"
          type="number"
          onChange={e => {
            props.onChangeCoordinateNumber('depthLow')(parseFloat(e.target.value));
          }}
          value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).depthLow}
          id="depthLow"
        />
      </div>

      <div className="col-md-2">
        <input
          placeholder="High"
          className="form-control"
          type="number"
          onChange={e => {
            props.onChangeCoordinateNumber('depthHigh')(parseFloat(e.target.value));
          }}
          value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).depthHigh}
          id="depthHigh"
        />
      </div>

      <div className="col-md-2">
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
      <div className="col-md-2">
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
    </div>
    <div className="row">
      <div className="col-md-2">
        <label htmlFor="note">Note</label>
      </div>
    </div>
    <div className="row">
      <div className="col-md-8">
        <textarea
          rows={6}
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
