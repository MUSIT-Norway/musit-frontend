import * as React from 'react';
import { CheckBox } from '../components/CheckBox';
import { CoordinateProps } from '../placeStateless/PlaceComponent';

const CoordinateMetaData = (props: CoordinateProps) => {
  return (
    <div className="container-fluid">
      <form className="form-horizontal">
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="coordinateSource">
            Coordinat source
          </label>
          <div className="col-md-6">
            <select
              className="form-control"
              id="coordinateSource"
              disabled={props.readOnly}
              defaultValue={undefined}
              value={
                props.editingCoordinateAttribute
                  ? props.editingCoordinateAttribute.coordinateSource
                  : undefined
              }
              onChange={e => {
                console.log('On change', e.target.value);
                props.onChangeCoordinateAttributes('coordinateSource')(e.target.value);
              }}
            >
              <option value={undefined} key={`optionRow_${'x'}`}>
                {'--- Not selected ---'}
              </option>
              {props.coordinatePredefined.coordinateSourceTypes ? (
                props.coordinatePredefined.coordinateSourceTypes.map(
                  ({ source }: { source: string }, i: number) => (
                    <option key={`optionRow_${i}`} value={source}>
                      {source}
                    </option>
                  )
                )
              ) : (
                <option value={undefined} key={`optionRow_${'xx'}`}>
                  {'--- No data ---'}
                </option>
              )}
            </select>
          </div>
          <div className="col-md-2">
            <div className="checkbox" id="coordinateAddedLater">
              <CheckBox
                id={'checkBoxCoordinateAddedLater'}
                viewMode={props.readOnly}
                checked={
                  props.editingCoordinateAttribute &&
                  props.editingCoordinateAttribute.addedLater
                    ? true
                    : false
                }
                displayValue="Added later"
                onChange={() => {
                  props.editingCoordinateAttribute &&
                  props.editingCoordinateAttribute.addedLater
                    ? props.onChangeCheckBoxBoolean('addedLater')(false)
                    : props.onChangeCheckBoxBoolean('addedLater')(true);
                }}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="precision">
            Precision/accuracy
          </label>
          <div className="col-md-2">
            <input
              className="form-control"
              type="number"
              disabled={props.readOnly}
              placeholder="Precision"
              defaultValue={undefined}
              onChange={e => {
                props.onChangeNumberCoordinateAttributes('precision')(
                  parseFloat(e.target.value)
                );
              }}
              value={
                props.editingCoordinateAttribute &&
                props.editingCoordinateAttribute.precision
              }
              id="precision"
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              type="number"
              disabled={props.readOnly}
              placeholder="Accuracy"
              onChange={e => {
                props.onChangeNumberCoordinateAttributes('gpsAccuracy')(
                  parseFloat(e.target.value)
                );
              }}
              value={
                props.editingCoordinateAttribute &&
                props.editingCoordinateAttribute.gpsAccuracy
              }
              id="accuracy"
            />
          </div>
          <div className="col-md-2">
            <div className="checkbox" id="coordinateAddedLater">
              <CheckBox
                id={'checkBoxCoordinateCa'}
                viewMode={props.readOnly}
                checked={
                  props.editingCoordinateAttribute &&
                  props.editingCoordinateAttribute.coordinateCa
                    ? true
                    : false
                }
                displayValue="Ca coordinate"
                onChange={() => {
                  props.editingCoordinateAttribute &&
                  props.editingCoordinateAttribute.coordinateCa
                    ? props.onChangeCheckBoxBoolean('coordinateCa')(false)
                    : props.onChangeCheckBoxBoolean('coordinateCa')(true);
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CoordinateMetaData;
