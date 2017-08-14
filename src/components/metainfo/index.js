// @flow
import React from 'react';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';
import { I18n } from 'react-i18nify';

type Props = {
  onClickEdit?: (e: { preventDefault: Function }) => void,
  updatedBy?: ?string,
  updatedDate?: ?number | ?string,
  registeredBy: ?string,
  registeredDate: ?number | ?string
};

const DateFormat = 'DD.MM.YYYY HH:mm';

export default function MetaInformation({
  updatedBy,
  updatedDate,
  registeredBy,
  registeredDate
}: Props) {
  return (
    <div>
      <div className="form-group">
        <label className="control-label col-sm-2" htmlFor="registeredBy">
          {I18n.t('musit.texts.registeredBy')}:
        </label>
        <div className="col-sm-6">
          <p className="form-control-static" id="registeredBy">
            <FontAwesome name="user" />
            {' '}
            {registeredBy}
            {' '}
            <FontAwesome name="clock-o" />
            {' '}
            {registeredDate && moment(registeredDate).format(DateFormat)}
          </p>
        </div>
      </div>
      {updatedBy &&
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="updatedBy">
            {I18n.t('musit.texts.lastUpdateBy')}:
          </label>
          <div className="col-sm-10">
            <p className="form-control-static" id="updatedBy">
              <FontAwesome name="user" />
              {' '}
              {updatedBy}
              {' '}
              <FontAwesome name="clock-o" />
              {' '}
              {updatedDate && moment(updatedDate).format(DateFormat)}
            </p>
          </div>
        </div>}
    </div>
  );
}
