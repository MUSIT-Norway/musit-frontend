// @flow
import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';
import * as moment from 'moment';
import { I18n } from 'react-i18nify';
import { Maybe } from '../../types/common';

type Props = {
  onClickEdit?: (e: { preventDefault: Function }) => void;
  updatedBy?: Maybe<string>;
  updatedDate?: Maybe<number> | Maybe<string>;
  registeredBy: Maybe<string>;
  registeredDate: Maybe<number> | Maybe<string>;
  aligned?: boolean;
};

const DateFormat = 'DD.MM.YYYY HH:mm';

export default function MetaInformation({
  updatedBy,
  updatedDate,
  registeredBy,
  registeredDate,
  aligned
}: Props) {
  if (aligned) {
    return (
      <div className="form-group">
        <div className="row">
          <div className="col-sm-2">
            <b>{I18n.t('musit.texts.registeredBy')}:</b>
          </div>
          <div className="col-sm-6">
            <FontAwesome name="user" /> {registeredBy} <FontAwesome name="clock-o" />{' '}
            {registeredDate && moment(registeredDate).format(DateFormat)}
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-sm-2">
            <b>{I18n.t('musit.texts.lastUpdateBy')}:</b>
          </div>
          <div className="col-sm-6">
            <FontAwesome name="user" /> {updatedBy} <FontAwesome name="clock-o" />{' '}
            {updatedDate && moment(updatedDate).format(DateFormat)}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="form-group">
        <label className="control-label col-sm-2" htmlFor="registeredBy">
          {I18n.t('musit.texts.registeredBy')}:
        </label>
        <div className="col-sm-6">
          <p className="form-control-static" id="registeredBy">
            <FontAwesome name="user" /> {registeredBy} <FontAwesome name="clock-o" />{' '}
            {registeredDate && moment(registeredDate).format(DateFormat)}
          </p>
        </div>
      </div>
      {updatedBy && (
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="updatedBy">
            {I18n.t('musit.texts.lastUpdateBy')}:
          </label>
          <div className="col-sm-10">
            <p className="form-control-static" id="updatedBy">
              <FontAwesome name="user" /> {updatedBy} <FontAwesome name="clock-o" />{' '}
              {updatedDate && moment(updatedDate).format(DateFormat)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
