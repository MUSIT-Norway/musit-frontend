import * as React from 'react';
import { CheckBox } from '../components/CheckBox';
import { CoordinateProps } from '../placeStateless/PlaceComponent';
import { altDepthUnits } from './mockdata/data';

const AltitudeDepthData = (props: CoordinateProps) => (
  <div className="container-fluid">
    <form className="form-horizontal">
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="altitudeFrom">
          Altitude
        </label>
        <div className="col-md-2">
          <input
            placeholder="From"
            className="form-control"
            type="number"
            disabled={props.readOnly}
            onChange={e => {
              props.onChangeNumberCoordinateAttributes('altitudeFrom')(
                parseFloat(e.target.value)
              );
            }}
            value={
              props.editingCoordinateAttribute &&
              props.editingCoordinateAttribute.altitudeFrom
            }
            id="altitudeFrom"
          />
        </div>

        <div className="col-md-2">
          <input
            placeholder="To"
            className="form-control"
            id="alt-h"
            type="number"
            disabled={props.readOnly}
            onChange={e => {
              props.onChangeNumberCoordinateAttributes('altitudeTo')(
                parseFloat(e.target.value)
              );
            }}
            value={
              props.editingCoordinateAttribute &&
              props.editingCoordinateAttribute.altitudeTo
            }
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-control"
            id="altitudeUnit"
            disabled={props.readOnly}
            value={
              props.editingCoordinateAttribute &&
              props.editingCoordinateAttribute.altitudeUnit
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
            <CheckBox
              id={'checkBoxCaAltitude'}
              viewMode={props.readOnly}
              checked={
                props.editingCoordinateAttribute &&
                props.editingCoordinateAttribute.altitudeCa
                  ? true
                  : false
              }
              displayValue="Ca altitude"
              onChange={() => {
                props.editingCoordinateAttribute &&
                props.editingCoordinateAttribute.altitudeCa
                  ? props.onChangeCheckBoxBoolean('altitudeCa')(false)
                  : props.onChangeCheckBoxBoolean('altitudeCa')(true);
              }}
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="depthFrom">
          Depth
        </label>
        <div className="col-md-2">
          <input
            placeholder="From"
            className="form-control"
            type="number"
            disabled={props.readOnly}
            onChange={e => {
              props.onChangeNumberCoordinateAttributes('depthFrom')(
                parseFloat(e.target.value)
              );
            }}
            value={
              props.editingCoordinateAttribute &&
              props.editingCoordinateAttribute.depthFrom
            }
            id="depthLow"
          />
        </div>

        <div className="col-md-2">
          <input
            placeholder="To"
            className="form-control"
            type="number"
            disabled={props.readOnly}
            onChange={e => {
              props.onChangeNumberCoordinateAttributes('depthTo')(
                parseFloat(e.target.value)
              );
            }}
            value={
              props.editingCoordinateAttribute && props.editingCoordinateAttribute.depthTo
            }
            id="depthHigh"
          />
        </div>

        <div className="col-md-2">
          <select
            className="form-control"
            id="depthUnit"
            disabled={props.readOnly}
            value={
              props.editingCoordinateAttribute &&
              props.editingCoordinateAttribute.depthUnit
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
              viewMode={props.readOnly}
              checked={
                props.editingCoordinateAttribute &&
                props.editingCoordinateAttribute.depthCa
                  ? true
                  : false
              }
              displayValue="Ca depth"
              onChange={() => {
                props.editingCoordinateAttribute &&
                props.editingCoordinateAttribute.depthCa
                  ? props.onChangeCheckBoxBoolean('depthCa')(false)
                  : props.onChangeCheckBoxBoolean('depthCa')(true);
              }}
            />
          </div>
        </div>
      </div>
    </form>
  </div>

  /*   <div className="form-group">
    <div className="row">
      <div className="col-md-2">
        <label htmlFor="altitude">Altitude</label>
        <input
          placeholder="Low"
          className="form-control"
          type="number"
          disabled={props.readOnly}
          onChange={e => {
            props.onChangeNumberCoordinateAttributes('altitudeFrom')(
              parseFloat(e.target.value)
            );
          }}
          value={
            props.editingCoordinateAttribute &&
            props.editingCoordinateAttribute.altitudeFrom
          }
          id="altitudeFrom"
        />
      </div>

      <div className="col-md-2">
        <label htmlFor="alt-h">..to</label>
        <input
          placeholder="High"
          className="form-control"
          id="alt-h"
          type="number"
          disabled={props.readOnly}
          onChange={e => {
            props.onChangeNumberCoordinateAttributes('altitudeTo')(
              parseFloat(e.target.value)
            );
          }}
          value={
            props.editingCoordinateAttribute &&
            props.editingCoordinateAttribute.altitudeTo
          }
        />
      </div>
      <div className="col-md-2">
        <label htmlFor="altitudeUnit">Unit </label>
        <select
          className="form-control"
          id="altitudeUnit"
          disabled={props.readOnly}
          value={
            props.editingCoordinateAttribute &&
            props.editingCoordinateAttribute.altitudeUnit
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
          <CheckBox
            id={'checkBoxCaAltitude'}
            viewMode={props.readOnly}
            checked={
              props.editingCoordinateAttribute &&
              props.editingCoordinateAttribute.altitudeCa
                ? true
                : false
            }
            displayValue="Ca altitude"
            onChange={() => {
              props.editingCoordinateAttribute &&
              props.editingCoordinateAttribute.altitudeCa
                ? props.onChangeCheckBoxBoolean('altitudeCa')(false)
                : props.onChangeCheckBoxBoolean('altitudeCa')(true);
            }}
          />
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-2">
        <label htmlFor="depthLow">Depth</label>
        <input
          placeholder="Low"
          className="form-control"
          type="number"
          disabled={props.readOnly}
          onChange={e => {
            props.onChangeNumberCoordinateAttributes('depthFrom')(
              parseFloat(e.target.value)
            );
          }}
          value={
            props.editingCoordinateAttribute && props.editingCoordinateAttribute.depthFrom
          }
          id="depthLow"
        />
      </div>

      <div className="col-md-2">
        <label htmlFor="depthHigh">..to </label>
        <input
          placeholder="High"
          className="form-control"
          type="number"
          disabled={props.readOnly}
          onChange={e => {
            props.onChangeNumberCoordinateAttributes('depthTo')(
              parseFloat(e.target.value)
            );
          }}
          value={
            props.editingCoordinateAttribute && props.editingCoordinateAttribute.depthTo
          }
          id="depthHigh"
        />
      </div>

      <div className="col-md-2">
        <label htmlFor="depthUnit">Unit </label>
        <select
          className="form-control"
          id="depthUnit"
          disabled={props.readOnly}
          value={
            props.editingCoordinateAttribute && props.editingCoordinateAttribute.depthUnit
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
            viewMode={props.readOnly}
            checked={
              props.editingCoordinateAttribute && props.editingCoordinateAttribute.depthCa
                ? true
                : false
            }
            displayValue="Ca depth"
            onChange={() => {
              props.editingCoordinateAttribute && props.editingCoordinateAttribute.depthCa
                ? props.onChangeCheckBoxBoolean('depthCa')(false)
                : props.onChangeCheckBoxBoolean('depthCa')(true);
            }}
          />
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-6">
        <label htmlFor="note">Note</label>
        <textarea
          rows={4}
          className="form-control"
          disabled={props.readOnly}
          onChange={e => {
            props.onChangeCoordinateAttributes('note')(e.target.value);
          }}
          value={
            props.editingCoordinateAttribute && props.editingCoordinateAttribute.note
          }
          id="note"
        />
      </div>
    </div>
  </div> */
);

export default AltitudeDepthData;
