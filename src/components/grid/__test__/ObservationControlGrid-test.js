import { assert, React, ReactTestUtils } from '../../../../test/setup';
import ObjectGrid from '../ObservationControlGrid';

describe('ObservationControlGrid', () => {
  let inputComponent
  before('should render ObservationControlGrid', () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <ObjectGrid
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
            registeredDate: '1983.01.01',
            registeredBy: 'Blabla...'
          },
          {
            id: 2,
            eventType: 'observation',
            doneDate: '1984.01.01',
            'subEvents-parts': [
              { eventType: 'ObservationTemperature', ok: true },
              { eventType: 'ObservationLightingConditions', ok: true }
            ],
            doneBy: 'Blablabla...',
            registeredDate: '1983.01.01',
            registeredBy: 'Blabla...'
          }
        ]}
      />
    );
    inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'td');
  });
  it('Check the 1st row Date value', () => {
    assert(inputComponent[1].innerHTML === '01.01.1983')
  })
  it('Check the 1st row registered date value', () => {
    assert(inputComponent[4].innerHTML === '01.01.1983')
  })
  it('Check the 2nd row Date value', () => {
    assert(inputComponent[7].innerHTML === '01.01.1984')
  })
  it('Check the 2nd row registered date value', () => {
    assert(inputComponent[10].innerHTML === '01.01.1983')
  })
})
