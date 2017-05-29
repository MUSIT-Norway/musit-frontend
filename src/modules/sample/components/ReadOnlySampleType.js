// @flow
import React from 'react';
import type { Field } from '../../../forms/form';

type Props = {
  sampleType: Field<string>,
  subTypeValue: Field<string>
};

export default function ReadOnlySampleType({ sampleType, subTypeValue }: Props) {
  return (
    <div className="form-group">
      <label className="control-label col-md-2">Prøvetype:</label>
      <div className="col-md-3">
        <p className="form-control-static">
          {sampleType.value}
        </p>
      </div>
      {sampleType.value !== subTypeValue.value &&
        <div>
          <label className="control-label col-md-2">Prøveundertype:</label>
          <div className="col-md-3">
            <p className="form-control-static">
              {subTypeValue.value}
            </p>
          </div>
        </div>}
    </div>
  );
}
