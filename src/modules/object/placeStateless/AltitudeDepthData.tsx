import * as React from 'react';
import { CheckBox } from '../components/CheckBox';
import { CoordinateProps } from '../placeStateless/PlaceComponent';
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
            props.onChangeCoordinateNumber('altitudeFrom')(parseFloat(e.target.value));
          }}
          value={
            props.editingCoordinate.coordinateAttributes &&
            props.editingCoordinate.coordinateAttributes.altitudeFrom
            //props.getCurrentCoordinate(props.coordinateHistoryIndeks).altitudeLow
          }
          id="altitudeLow"
        />
      </div>

      <div className="col-md-2">
        <input
          placeholder="High"
          className="form-control"
          type="number"
          onChange={e => {
            props.onChangeCoordinateNumber('altitudeTo')(parseFloat(e.target.value));
          }}
          value={
            props.editingCoordinate.coordinateAttributes &&
            props.editingCoordinate.coordinateAttributes.altitudeTo
            //props.getCurrentCoordinate(props.coordinateHistoryIndeks).altitudeHigh
          }
          id="altitudeHigh"
        />
      </div>

      <div className="col-md-2">
        <select
          className="form-control"
          id="altitudeUnit"
          value={
            props.editingCoordinate.coordinateAttributes &&
            props.editingCoordinate.coordinateAttributes.altitudeUnit
            //props.getCurrentCoordinate(props.coordinateHistoryIndeks).altitudeUnit
          }
          onChange={e => {
            props.onChangeCoordinateAttributes('altitudeUnit')(e.target.value);
          }}
        >
          {altDepthUnits.map((type: string, i: number) => (
            <option key={`optionRow_${i}`}>{type}</option>
          ))}
        </select>
      </div>
      <div className="col-md-2">
        <div className="checkbox" id="caAltitude">
          {console.log(
            'in checkbox ca altitude : ',
            props.editingCoordinate.coordinateAttributes &&
              props.editingCoordinate.coordinateAttributes.altitudeCa
          )}
          <CheckBox
            id={'checkBoxCaAltitude'}
            checked={
              props.editingCoordinate.coordinateAttributes &&
              props.editingCoordinate.coordinateAttributes.altitudeCa
                ? true
                : false
            }
            displayValue="Ca altitude"
            onChange={() => {
              props.editingCoordinate.coordinateAttributes &&
              props.editingCoordinate.coordinateAttributes.altitudeCa
                ? props.onChangeCheckBoxBoolean('altitudeCa')(false)
                : props.onChangeCheckBoxBoolean('altitudeCa')(true);

              /* props.getCurrentCoordinate(props.coordinateHistoryIndeks) &&
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).caAltitude */
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
            props.onChangeCoordinateNumber('depthFrom')(parseFloat(e.target.value));
          }}
          value={
            props.editingCoordinate.coordinateAttributes &&
            props.editingCoordinate.coordinateAttributes.depthFrom
            //props.getCurrentCoordinate(props.coordinateHistoryIndeks).depthLow
          }
          id="depthLow"
        />
      </div>

      <div className="col-md-2">
        <input
          placeholder="High"
          className="form-control"
          type="number"
          onChange={e => {
            props.onChangeCoordinateNumber('depthTo')(parseFloat(e.target.value));
          }}
          value={
            props.editingCoordinate.coordinateAttributes &&
            props.editingCoordinate.coordinateAttributes.depthTo
            //props.getCurrentCoordinate(props.coordinateHistoryIndeks).depthHigh
          }
          id="depthHigh"
        />
      </div>

      <div className="col-md-2">
        <select
          className="form-control"
          id="depthUnit"
          value={
            props.editingCoordinate.coordinateAttributes &&
            props.editingCoordinate.coordinateAttributes.depthUnit
            //props.getCurrentCoordinate(props.coordinateHistoryIndeks).depthUnit
          }
          onChange={e => {
            props.onChangeCoordinateAttributes('depthUnit')(e.target.value);
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
              /* props.getCurrentCoordinate(props.coordinateHistoryIndeks) &&
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).caDepth */
              props.editingCoordinate.coordinateAttributes &&
              props.editingCoordinate.coordinateAttributes.depthCa
                ? true
                : false
            }
            displayValue="Ca depth"
            onChange={() => {
              /* props.getCurrentCoordinate(props.coordinateHistoryIndeks) &&
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).caDepth */
              props.editingCoordinate.coordinateAttributes &&
              props.editingCoordinate.coordinateAttributes.depthCa
                ? props.onChangeCheckBoxBoolean('depthCa')(false)
                : props.onChangeCheckBoxBoolean('depthCa')(true);
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
            props.onChangeCoordinateAttributes('note')(e.target.value);
          }}
          value={
            props.editingCoordinate.coordinateAttributes &&
            props.editingCoordinate.coordinateAttributes.note
            //props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateNote
          }
          id="note"
        />
      </div>
    </div>
  </div>
);

export default AltitudeDepthData;
