import assert from 'assert';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import ObservationControlGrid from '../EventsGrid';

describe('ObservationControlGrid', () => {
  let inputComponent;
  const setup = () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <ObservationControlGrid
        id={1}
        translate={(key) => key}
        tableData={[
          {
            id: 1,
            eventType: 'control',
            doneDate: '2017-01-01T09:42:52+00:00',
            'subEvents-parts': [
              { eventType: 'ControlAlcohole', ok: true },
              { eventType: 'ControlPest', ok: true }
            ],
            doneBy: 'Blablabla...',
            registeredDate: '2017-01-04T09:42:57+00:00',
            registeredBy: 'Blabla...'
          },
          {
            id: 2,
            eventType: 'observation',
            doneDate: '2017-01-03T09:42:52+00:00',
            'subEvents-parts': [
              { eventType: 'ObservationTemperature' },
              { eventType: 'ObservationLightingConditions' }
            ],
            doneBy: 'Blablabla...',
            registeredDate: '2017-01-08T09:42:57+00:00',
            registeredBy: 'Blabla...'
          }
        ]}
      />
    );
    inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'td');
  };

  it('Check the 1st row Date value', () => {
    setup();
    assert(inputComponent[1].innerHTML === '01.01.2017');
  });
  it('Check the 1st row registered date value', () => {
    setup();
    assert(inputComponent[4].innerHTML === '04.01.2017');
  });
  it('Check the 2nd row Date value', () => {
    setup();
    assert(inputComponent[7].innerHTML === '03.01.2017');
  });
  it('Check the 2nd row registered date value', () => {
    setup();
    assert(inputComponent[10].innerHTML === '08.01.2017');
  });
});
