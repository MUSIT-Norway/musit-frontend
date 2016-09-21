import React from 'react'
import { ReactTestUtils, assert } from '../../../../../test/setup'
import ControlAddContainer from '../index'
import moment from 'moment'
import { DATE_FORMAT_DISPLAY } from './../../../../util'

describe('Render add control page', () => {
  const renderer = ReactTestUtils.createRenderer();
  let observationPage;

  beforeEach(() => {
    renderer.render(
      <ControlAddContainer
        translate={(key) => key}
        params={{ }}
        saveControl={() => true}
      />
    )
    observationPage = renderer.getRenderOutput()
  })

  it('should set default date and have correct date format', () => {
    const dateProps = observationPage
            .props
            .content
            .props
            .children[1]
            .props
            .children[0]
            .props
            .children[0]
            .props
            .children[1]
            .props
            .children[1]
            .props
            .children
            .props
            .children
            .props

    assert(dateProps.dateFormat === DATE_FORMAT_DISPLAY)
    assert(moment(dateProps.value, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid())
  })
})
