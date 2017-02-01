import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import ObservationControlGrid from '../EventsGrid';

describe('ObservationControlGrid', () => {
  it('Check the 1st row Date value', () => {
    const myDiv = shallow(
      <ObservationControlGrid
        id={"1"}
        translate={(key) => key}
        tableData={[
          {
            id: 1,
            doneDate: '2017-01-01T09:42:52+00:00',
            doneBy: 'Blablabla...',
            registeredDate: '2017-01-04T09:42:57+00:00',
            registeredBy: 'Blabla...',
            eventType: 'control',
            lightingCondition: {
              ok: true
            }
          },
          {
            id: 1,
            doneDate: '2017-01-01T09:42:52+00:00',
            doneBy: 'Blablabla...',
            registeredDate: '2017-01-04T09:42:57+00:00',
            registeredBy: 'Blabla...',
            eventType: 'control',
            temperature: {
              ok: true
            }
          },
          {
            id: 1,
            doneDate: '2017-01-01T09:42:52+00:00',
            doneBy: 'Blablabla...',
            registeredDate: '2017-01-04T09:42:57+00:00',
            registeredBy: 'Blabla...',
            eventType: 'control',
            hypoxicAir: {
              ok: true
            }
          },
          {
            id: 1,
            doneDate: '2017-01-01T09:42:52+00:00',
            doneBy: 'Blablabla...',
            registeredDate: '2017-01-04T09:42:57+00:00',
            registeredBy: 'Blabla...',
            eventType: 'control',
            relativeHumidity: {
              ok: true
            }
          },
          {
            id: 1,
            doneDate: '2017-01-01T09:42:52+00:00',
            doneBy: 'Blablabla...',
            registeredDate: '2017-01-04T09:42:57+00:00',
            registeredBy: 'Blabla...',
            eventType: 'control',
            cleaning: {
              ok: true
            }
          },
          {
            id: 1,
            doneDate: '2017-01-01T09:42:52+00:00',
            doneBy: 'Blablabla...',
            registeredDate: '2017-01-04T09:42:57+00:00',
            registeredBy: 'Blabla...',
            eventType: 'control',
            mold: {
              ok: true
            }
          },
          {
            id: 1,
            doneDate: '2017-01-01T09:42:52+00:00',
            doneBy: 'Blablabla...',
            registeredDate: '2017-01-04T09:42:57+00:00',
            registeredBy: 'Blabla...',
            eventType: 'control',
            alcohol: {
              ok: true
            }
          },
          {
            id: 1,
            doneDate: '2017-01-01T09:42:52+00:00',
            doneBy: 'Blablabla...',
            registeredDate: '2017-01-04T09:42:57+00:00',
            registeredBy: 'Blabla...',
            eventType: 'control',
            gas: {
              ok: true
            }
          },
          {
            id: 1,
            doneDate: '2017-01-01T09:42:52+00:00',
            doneBy: 'Blablabla...',
            registeredDate: '2017-01-04T09:42:57+00:00',
            registeredBy: 'Blabla...',
            eventType: 'control',
            waterDamageAssessment: {
              ok: true
            }
          },
          {
            id: 1,
            doneDate: '2017-01-01T09:42:52+00:00',
            doneBy: 'Blablabla...',
            registeredDate: '2017-01-04T09:42:57+00:00',
            registeredBy: 'Blabla...',
            eventType: 'control',
            fireProtection: {
              ok: true
            }
          },
          {
            id: 1,
            doneDate: '2017-01-01T09:42:52+00:00',
            doneBy: 'Blablabla...',
            registeredDate: '2017-01-04T09:42:57+00:00',
            registeredBy: 'Blabla...',
            eventType: 'control',
            theftProtection: {
              ok: true
            }
          },
          {
            id: 1,
            doneDate: '2017-01-01T09:42:52+00:00',
            doneBy: 'Blablabla...',
            registeredDate: '2017-01-04T09:42:57+00:00',
            registeredBy: 'Blabla...',
            eventType: 'control',
            perimeterSecurity: {
              ok: true
            }
          },
          {
            id: 1,
            doneDate: '2017-01-01T09:42:52+00:00',
            doneBy: 'Blablabla...',
            registeredDate: '2017-01-04T09:42:57+00:00',
            registeredBy: 'Blabla...',
            eventType: 'control',
            pest: {
              ok: true
            }
          }
        ]}
      />
    );
    expect(shallowToJson(myDiv)).toMatchSnapshot();
  });
});
