// @flow
import React from 'react';
import { DATE_FORMAT_DISPLAY } from '../../shared/util';
import moment from 'moment';
import { I18n } from 'react-i18nify';
import type { Person } from '../../types/person';

type Props = {
  personData: Array<Person>,
  getDisplayNameForRole?: Function
};

export const ViewPersonRoleDate = ({ personData, getDisplayNameForRole }: Props) => (
  <div>
    <table className="table table-responsive table-condensed">
      <thead>
        <tr>
          <th>
            <strong>{I18n.t('musit.texts.name')}</strong>
          </th>
          <th>
            <strong>{I18n.t('musit.texts.role')}</strong>
          </th>
          <th>
            <strong>{I18n.t('musit.texts.date')}</strong>
          </th>
        </tr>
      </thead>
      <tbody>
        {personData.map((p: Person, i: number) => {
          return (
            <tr key={`key-${i}`}>
              <td>{p.name}</td>
              <td>{getDisplayNameForRole && getDisplayNameForRole(p.role)}</td>
              <td>{p.date && moment(p.date).format(DATE_FORMAT_DISPLAY)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default ViewPersonRoleDate;
