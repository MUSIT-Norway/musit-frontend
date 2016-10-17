import assert from 'assert'
import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
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
