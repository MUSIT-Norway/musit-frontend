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
            doneDate: '1983.01.01',
            'subEvents-parts': [
              { eventType: 'ControlAlcohole', ok: true },
              { eventType: 'ControlPest', ok: true }
            ],
            doneBy: 'Blablabla...',
            registeredDate: '1983.01.04',
            registeredBy: 'Blabla...'
          },
          {
            id: 2,
            eventType: 'observation',
            doneDate: '1984.01.01',
            'subEvents-parts': [
              { eventType: 'ObservationTemperature' },
              { eventType: 'ObservationLightingConditions' }
            ],
            doneBy: 'Blablabla...',
            registeredDate: '1984.01.04',
            registeredBy: 'Blabla...'
          }
        ]}
      />
    );
    inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'td');
  };

  it('Check the 1st row Date value', () => {
    setup();
    assert(inputComponent[1].innerHTML === '01.01.1983');
  });
  it('Check the 1st row registered date value', () => {
    setup();
    assert(inputComponent[4].innerHTML === '04.01.1983');
  });
  it('Check the 2nd row Date value', () => {
    setup();
    assert(inputComponent[7].innerHTML === '01.01.1984');
  });
  it('Check the 2nd row registered date value', () => {
    setup();
    assert(inputComponent[10].innerHTML === '04.01.1984');
  });
});
