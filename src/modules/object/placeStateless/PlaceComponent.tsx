import * as React from 'react';
import CoordinateComponent from './CoordinateComponent';
import CoordinateHeader from './CoordinateHeader';
import { PlaceState, CoordinateProps } from './CollectionEvents';
import AdmPlaceComponent from './AdmPlaceComponent';
import { CheckBox } from '../components/CheckBox';

const PlaceComponent= (
    props: PlaceState & {
        onChange: (value: string) => void;
        onChangeOthers: (field: string) => (value: string) => void;
      } & CoordinateProps
    ) => { 
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
                  <CoordinateComponent {...props} />
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
            );
          };
    return (
        <div>
          <PageBodyComponent {...props} />
        </div>
    );
}
export default PlaceComponent;