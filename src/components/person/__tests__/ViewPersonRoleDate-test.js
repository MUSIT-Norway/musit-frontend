// @flow
import ViewPersonRoleDate from '../ViewPersonRoleDate';
import { shallow } from 'enzyme';
import React from 'react';

declare var describe: any;
declare var it: any;
declare var expect: any;

describe('ViewPersonRoleDate', () => {
  it('should match snapshot', () => {
    const wrapperBefore = shallow(
      <ViewPersonRoleDate
        personData={[]}
        roles={['doneBy', 'responsible', 'madman']}
        updateForm={x => x}
        fieldName="Persons"
        appSession={{
          museumId: 99,
          collectionId: 'ererefdfd',
          accessToken: 'd444dddd',
          actor: { fn: 'Stein Olsen' },
          language: {
            isEn: false,
            isNo: true
          }
        }}
        showDateForRole={r => r === 'doneBy'}
        getDisplayNameForRole={(r: string) => {
          if (r === 'doneBy') {
            return 'Utført av';
          } else if (r === 'responsible') {
            return 'Ansvarlig';
          } else {
            return 'Ukjent';
          }
        }}
      />
    );

    const wrapperAfter = shallow(
      <ViewPersonRoleDate
        personData={[
          { fn: 'Stein Olsen', role: 'doneBy', date: '2017-07-02T17:42:28+00:00' },
          {
            fn: 'Thor Heyerdahl',
            role: 'responsible',
            date: '2017-07-02T17:42:28+00:00'
          },
          {
            fn: 'Christian Radich',
            role: 'responsible',
            date: '2017-07-02T17:42:28+00:00'
          }
        ]}
        appSession={{
          museumId: 99,
          collectionId: 'ererefdfd',
          accessToken: 'd444dddd',
          actor: { fn: 'Stein Olsen' },
          language: {
            isEn: false,
            isNo: true
          }
        }}
        roles={['doneBy', 'responsible', 'madman']}
        updateForm={x => x}
        fieldName="Persons"
        showDateForRole={r => r === 'doneBy'}
        getDisplayNameForRole={r => {
          if (r === 'doneBy') {
            return 'Utført av';
          } else if (r === 'responsible') {
            return 'Ansvarlig';
          } else {
            return 'Ukjent';
          }
        }}
      />
    );
    expect(wrapperAfter.find('tr').length - wrapperBefore.find('tr').length).toBe(3);
  });
});