// @flow
import React from 'react';
import FontAwesome from 'react-fontawesome';
import type { FormData } from '../types/form';

type Props = {
  form: FormData,
  onClickEdit?: () => void
};

export default function MetaInformation({ form, onClickEdit }: Props) {
  return (
    <div>
      <div className="form-group">
        <label className="control-label col-sm-2" htmlFor="registeredBy">
          Registrert av:
        </label>
        <div className="col-sm-6">
          <p className="form-control-static" id="registeredBy">
            <FontAwesome name="user" />
            {' '}
            {form.registeredByName.value}
            {' '}
            <FontAwesome name="clock-o" />
            {' '}
            {form.registeredDate.value}
          </p>
        </div>
        {onClickEdit &&
          <button className="btn btn-default pull-right" onClick={onClickEdit}>
            Endre
          </button>}
      </div>
      {form.updatedBy.value &&
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="updatedBy">
            Sist endret:
          </label>
          <div className="col-sm-10">
            <p className="form-control-static" id="updatedBy">
              <FontAwesome name="user" />
              {' '}
              {form.updatedByName.value}
              {' '}
              <FontAwesome name="clock-o" />
              {' '}
              {form.updatedDate.value}
            </p>
          </div>
        </div>}
    </div>
  );
}
