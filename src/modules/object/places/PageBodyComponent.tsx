import * as React from 'react';
// import { CheckBox } from '../components/CheckBox';
import CoordinateComponent from './CoordinateComponent';
import CoordinateHeader from './CoordinateHeader';
import { PlaceState, CoordinateProps } from './PlaceComponent';
import AdmPlaceComponent from './AdmPlaceComponent';
import { CheckBox } from '../components/CheckBox';
import * as FontAwesome from 'react-fontawesome';

const PageBodyComponent = (
  props: PlaceState & {
    onChange: (value: string) => void;
    onChangeOthers: (field: string) => (value: string) => void;
  } & CoordinateProps
) => {
  return (
    <div className="panel-group">
      <div className="row well form-group">
        <AdmPlaceComponent
          {...props}
          onChangeOthers={props.onChangeOthers}
          onChange={props.onChange}
        />
        <CoordinateHeader {...props} />
        <div style={{ textAlign: 'right' }}>
          <button
            data-toggle="tooltip"
            title={
              props.coordinateCollapsed
                ? 'Click to Expand Coordinate Details'
                : 'Click to Hide Coordinate Details'
            }
            onClick={e => {
              props.onToggleCollapse();
              e.preventDefault();
            }}
            className="btn btn-default"
          >
            <FontAwesome
              name={props.coordinateCollapsed ? 'chevron-down' : 'chevron-up'}
              style={{ color: 'black', float: 'right' }}
            />
          </button>
        </div>
      </div>
      <div className="row" style={{ alignContent: 'left' }} />
      <br />
      <div className="row">
        <div className="panel-group">
          <div className="panel panel-default">
            <div className="panel-heading">
              <div
                className={`panel-collapse${
                  props.coordinateCollapsed ? ' collapse' : ' in'
                }`}
              >
                <div className="panel-body">
                  <div>
                    <CoordinateComponent {...props} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-10" style={{ textAlign: 'right' }}>
                  <CheckBox
                    id="CoordinateEditMode"
                    checked={props.editCoordinateMode}
                    displayValue="Edit mode?"
                    onChange={() =>
                      props.onChangeEditMode(props.editCoordinateMode ? false : true)
                    }
                  />
                </div>
                <div className="col-md-2" style={{ textAlign: 'right' }}>
                  <button
                    className="btn btn-default"
                    onClick={e => {
                      e.preventDefault();
                      props.onClickSaveRevision();
                    }}
                  >
                    {props.editCoordinateMode ? 'Save' : 'Save revision'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageBodyComponent;
