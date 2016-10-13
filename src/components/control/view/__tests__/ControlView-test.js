import { assert, React, ReactTestUtils } from '../../../../../test/setup';
import ControlView from '../ControlView';

describe('ControlView', () => {
  let temperatureButton;
  let relativeHumidityButton;

  beforeEach(() => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <ControlView
        id="1"
        translate={(key) => key}
        controlsJson={{
          temperature: {
            ok: false,
            observation: {
              range: {
                from: 1
              },
              note: 'bra'
            }
          },
          relativeHumidity: {
            ok: true
          }
        }}
      />
    );
    const inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'button');
    temperatureButton = inputComponent[0];
    relativeHumidityButton = inputComponent[1];
  });

  it('Check the temperature component is created by checking down button id', () => {
    assert(temperatureButton.getAttribute('id') === '1_temperature_downButton')
  })
  it('Check the relativeHumidity component is created by checking down button id', () => {
    assert(relativeHumidityButton.getAttribute('id') === '1_relativeHumidity_downButton')
  })
})
