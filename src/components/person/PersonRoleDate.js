// @flow
import React from 'react';
import { ActorSuggest } from '../../components/suggest/ActorSuggest';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import DropdownButton from '../../components/DropdownButton';
import DatePicker from '../DatePicker';
import { DATE_FORMAT_DISPLAY } from '../../shared/util';
import type { AppSession } from '../../types/appSession';
import type { Person } from '../../types/person';
import MusitActor from '../../models/actor';
import moment from 'moment';
import { I18n } from 'react-i18nify';

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
  appSession,
  updateForm,
  fieldName,
  roles,
  showDateForRole,
  getDisplayNameForRole
}: Props) => {
  const pArr: Array<Person> = personData.length > 0 ? personData : defaultPersons;
  return (
    pArr &&
    <Grid>
      <Row>
        <Col md={2}>
          <strong>{I18n.t('musit.texts.name')}</strong>
        </Col>
        <Col md={2}>
          <strong>{I18n.t('musit.texts.role')}</strong>
        </Col>
        {showDateForRole &&
          <Col md={2}>
            <strong>{I18n.t('musit.texts.date')}</strong>
          </Col>}
        <Col md={2} />
      </Row>
      <br />
      {pArr.map((v, i) => (
        <Row key={`id_${i}`}>
          <Col md={2}>
            <ActorSuggest
              appSession={appSession}
              key={`id_${i}`}
              id={`id_${i}`}
              value={v.name || ''}
              placeHolder={I18n.t('musit.analysis.restrictions.findActor')}
              onChange={newValue => {
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
          </Col>
          <Col md={2}>
            <DropdownButton
              id={`role_${i}`}
              items={roles}
              displayItems={roles.map(
                r => getDisplayNameForRole && getDisplayNameForRole(r)
              )}
              index={i}
              onChange={role =>
                updateForm({
                  name: fieldName,
                  rawValue: updateRole(i, role, pArr)
                })}
              title={
                v.role
                  ? (getDisplayNameForRole && getDisplayNameForRole(v.role)) || v.role
                  : I18n.t('musit.texts.chooseRole')
              }
            />
          </Col>
          {showDateForRole &&
            <Col md={2}>
              {showDateForRole(v.role) &&
                <DatePicker
                  dateFormat={DATE_FORMAT_DISPLAY}
                  value={v.date}
                  onClear={newValue =>
                    updateForm({
                      name: fieldName,
                      rawValue: updateDate(i, newValue, pArr)
                    })}
                  onChange={newValue => {
                    updateForm({
                      name: fieldName,
                      rawValue: updateDate(i, newValue, pArr)
                    });
                  }}
                />}
            </Col>}
          <Col md={1}>
            <FontAwesome
              name={'times'}
              onClick={() =>
                updateForm({
                  name: fieldName,
                  rawValue: deletePerson(i, pArr)
                })}
            />
          </Col>
        </Row>
      ))}
      <Row>
        <Col md={6}>
          <Button
            onClick={() =>
              updateForm({
                name: fieldName,
                rawValue: addPerson(pArr)
              })}
          >
            {I18n.t('musit.analysis.addPersons')}
          </Button>
        </Col>
      </Row>
    </Grid>
  );
};

function addPerson(persons: Array<Person>): Array<Person> {
  return [...persons, { date: moment().format() }];
}

function deletePerson(i: number, persons: Array<Person>): Array<Person> {
  return [...persons.slice(0, i), ...persons.slice(i + 1)];
}

function updateRole(i, role: string, persons: Array<Person>) {
  return updatePerson(i, { ...persons[i], role }, persons);
}

function updateDate(i, date: string, persons: Array<Person>) {
  return updatePerson(i, { ...persons[i], date }, persons);
}

function updatePerson(i, person: Person, persons: Array<Person>) {
  return [...persons.slice(0, i), person, ...persons.slice(i + 1)];
}

export default PersonRoleDate;
