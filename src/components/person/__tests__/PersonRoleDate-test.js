// @flow
import PersonRoleDate from '../PersonRoleDate';
import { shallow } from 'enzyme';
import React from 'react';

describe('PersonRoleDate', () => {
  it('should match snapshot', () => {
    const wrapperBefore = shallow(
      <PersonRoleDate
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
      <PersonRoleDate
        personData={[
          {
            uuid: '0000-0000-0000-0000',
            fn: 'Stein Olsen',
            role: 'doneBy',
            date: '12.01.2001'
          },
          {
            uuid: '0000-0000-0000-0001',
            fn: 'Thor Heyerdahl',
            role: 'responsible',
            date: '12.01.2001'
          },
          {
            uuid: '0000-0000-0000-0002',
            fn: 'Christian Radich',
            role: 'responsible',
            date: '12.01.2001'
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
    //Empty input gives one empty line in PersonRoleTable, thus difference is 2
    expect(wrapperAfter.find('tr').length - wrapperBefore.find('tr').length).toBe(2);
  });
});
