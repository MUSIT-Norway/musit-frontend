import assert from 'assert'
import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import ObservationDoubleTextAreaComponent from '../../../src/components/observation/ObservationDoubleTextAreaComponent'

describe('ObservationDoubleTextAreaComponent', () => {
  let inputElementLeft
  let inputElementRight

  before('should render ObservationDoubleTextAreaComponent', () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <ObservationDoubleTextAreaComponent
        id='test'
        translate={(key) => key}
        leftLabel='Left label'
        leftValue='left'
        leftTooltip='Left tooltip'
        leftPlaceHolder='Left placeholder'
        leftWidth={3}
        rightPlaceHolder='Right placeholder'
        onChangeLeft={() => ('ji')}
        rightLabel='Right label'
        rightValue='right'
        rightTooltip='Right tooltip'
        rightWidth={3}
        onChangeRight={() => ('ji')}
      />
    )
    const inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'textarea')
    inputElementLeft = inputComponent[0]
    inputElementRight = inputComponent[1]
  })

  it('Check the left text area number of row', () => {
    assert(inputElementLeft.getAttribute('rows') === '5')
  })

  it('Check the left text area Tooltip', () => {
    assert(inputElementLeft.getAttribute('title') === 'Left tooltip')
  })

  it('Check left value', () => {
    assert(inputElementLeft.value === 'left')
  })

  it('Check the right text area number of row', () => {
    assert(inputElementRight.getAttribute('rows') === '5')
  })
})
