import * as React from 'react';
import { CheckBox } from '../components/CheckBox';
import CoordinateComponent from './CoordinateComponent';
import CoordinateHeader from './CoordinateHeader';
import { CoordinateProps } from './PlaceComponent';

const CoordinateComp = (props: CoordinateProps) => {
  return (
    <div className="panel-group">
      <div className="panel panel-default">
        <div className="panel-heading">
          <CoordinateHeader {...props} />
          <button
            onClick={e => {
              props.onToggleCollapse();
              e.preventDefault();
            }}
            className="btn btn-default"
          >
            {props.coordinateCollapsed ? 'Show details' : 'Hide details'}
          </button>
          <div
            className={`panel-collapse${props.coordinateCollapsed ? ' collapse' : ' in'}`}
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
  );
};

export default CoordinateComp;
