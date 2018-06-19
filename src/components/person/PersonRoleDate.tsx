// @flow
import * as React from 'react';
import { ActorSuggest } from '../../components/suggest/ActorSuggest';
import { Row, Col } from 'react-bootstrap';
import DropdownButton from '../../components/DropdownButton';
import DatePicker from '../DatePicker';
import { DATE_FORMAT_DISPLAY } from '../../shared/util';
import  { AppSession } from '../../types/appSession';
import  { Person } from '../../types/person';
import MusitActor from '../../models/actor';
import * as moment from 'moment';
import { I18n } from 'react-i18nify';
import { MUSTFIX, TODO } from '../../types/common';

const defaultPerson: Person = {
  name: '',
  uuid: '',
  role: '',
  date: moment().format()
};

const defaultPersons: Array<Person> = [defaultPerson];

type Props = {
  personData: Array<Person>,
  updateForm: Function,
  fieldName: string,
  appSession: AppSession,
  roles: Array<string>,
  showDateForRole?: Function,
  getDisplayNameForRole?: Function
};

export const PersonRoleDate = ({
  personData,
  updateForm,
  fieldName,
  appSession,
  roles,
  showDateForRole,
  getDisplayNameForRole
}: Props) => {
  const pArr: Array<Person> =
    personData && personData.length > 0 ? personData : defaultPersons;
  return (
    pArr && (
      <div>
        <table className="table table-responsive" style={{ width: '60%' }}>
          <thead>
            <tr>
              <th>
                <strong>{I18n.t('musit.texts.name')}</strong>
              </th>
              <th>
                <strong>{I18n.t('musit.texts.role')}</strong>
              </th>
              <th>{showDateForRole && <strong>{I18n.t('musit.texts.date')}</strong>}</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {pArr.map((v, i) => (
              <tr key={`id_${i}`}>
                <td>
                  <ActorSuggest
                    appSession={appSession}
                    key={`id_${i}`}
                    id={`id_${i}`}
                    value={v.name || ''}
                    placeHolder={I18n.t('musit.analysis.restrictions.findActor')}
                    onChange={(newValue:TODO) => {
                      updateForm({
                        name: fieldName,
                        rawValue: updatePerson(
                          i,
                          {
                            ...v,
                            name: newValue.fn,
                            uuid: MusitActor.getActorId(newValue) || undefined
                          },
                          pArr
                        )
                      });
                    }}
                  />
                </td>
                <td>
                  <DropdownButton
                    id={`role_${i}`}
                    items={roles}
                    displayItems={roles.map(
                      r => (getDisplayNameForRole && getDisplayNameForRole(r)) || r
                    )}
                    //Originally had this assignment, but this property doesn't seem to exist: index={i}
                    onChange={(r:TODO) =>
                      updateForm({
                        name: fieldName,
                        rawValue: updateRole(i, r, pArr)
                      })}
                    title={
                      v.role ? (
                        (getDisplayNameForRole && getDisplayNameForRole(v.role)) ||
                        v.role.toString()
                      ) : (
                        I18n.t('musit.texts.chooseRole')
                      )
                    }
                  />
                </td>
                <td>
                  {showDateForRole &&
                  showDateForRole(v.role) && (
                    <DatePicker
                      dateFormat={DATE_FORMAT_DISPLAY}
                      value={v.date}
                      onClear={(newValue:TODO) =>
                        updateForm({
                          name: fieldName,
                          rawValue: updateDate(i, newValue, pArr)
                        })}
                      onChange={(newValue:TODO) => {
                        updateForm({
                          name: fieldName,
                          rawValue: updateDate(i, newValue, pArr)
                        });
                      }}
                    />
                  )}
                </td>
                <td>
                  <a
                    href="delete"
                    onClick={e => {
                      e.preventDefault();
                      updateForm({
                        name: fieldName,
                        rawValue: deletePerson(i, pArr)
                      });
                    }}
                  >
                    {I18n.t('musit.texts.delete')}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Row>
          <Col md={6}>
            <a
              href="add"
              onClick={e => {
                e.preventDefault();
                updateForm({
                  name: fieldName,
                  rawValue: addPerson(pArr)
                });
              }}
            >
              {I18n.t('musit.analysis.addPersons')}
            </a>
          </Col>
        </Row>
      </div>
    )
  );
};

function addPerson(persons: Array<Person>): Array<Person> {
  return [...persons, { uuid: '', date: moment().format() }];
}

function deletePerson(i: number, persons: Array<Person>): Array<Person> {
  return [...persons.slice(0, i), ...persons.slice(i + 1)];
}

function updateRole(i:number, role: string | number, persons: Array<Person>) {
  return updatePerson(i, { ...persons[i], role }, persons);
}

function updateDate(i:number, date: string, persons: Array<Person>) {
  return updatePerson(i, { ...persons[i], date }, persons);
}

function updatePerson(i:number, person: Person, persons: Array<Person>) {
  return [...persons.slice(0, i), person, ...persons.slice(i + 1)];
}

export default PersonRoleDate;
