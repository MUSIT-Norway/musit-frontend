import assert from 'assert'
import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import ControlView from '../../../../src/components/control/view/ControlView'

describe('ControlView', () => {
  let temperatureButton
  let relativeHumidityButton

  before('should render ControlView', () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <ControlView
        id='1'
        translate={(key) => key}
        controlsJson={[
          {
            eventType: 'ControlTemperature',
            ok: true
          },
          {
            eventType: 'ControlRelativeHumidity',
            ok: true
          }
        ]}
      />
    )
    const inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'button')
    temperatureButton = inputComponent[0]
    relativeHumidityButton = inputComponent[1]
  })

  it('Check the temperature component is created by checking down button id', () => {
    assert(temperatureButton.getAttribute('id') === '1_ControlTemperature_downButton')
  })
  it('Check the relativeHumidity component is created by checking down button id', () => {
    assert(relativeHumidityButton.getAttribute('id') === '1_ControlRelativeHumidity_downButton')
  })
})
