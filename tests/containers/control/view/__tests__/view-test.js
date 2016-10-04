import React from 'react'
import { ReactTestUtils, assert } from '../../../../setup'
import ControlViewContainer from 'containers/control/view'
import moment from 'moment'
import { DATE_FORMAT_DISPLAY } from 'utils'

describe('Render view control page', () => {
  const renderer = ReactTestUtils.createRenderer()
  let observationPage

  beforeEach(() => {
    renderer.render(
      <ControlViewContainer
        translate={(key) => key}
        saveControl={() => true}
        loadControl={() => true}
        doneBy={{
          id: 1,
          fn: 'Jarl'
        }}
        params={{

        }}
        controls={{
          data: {
            doneBy: { id: 1, fn: 'Arne And' },
            doneDate: moment().toISOString(),
            registeredBy: 'Stein Olsen',
            registeredDate: moment().toISOString()
          }
        }}
        loadPersonNameFromId={() => true}
      />
    )
    observationPage = renderer.getRenderOutput()
  })

  it('should set default date and have correct date format for doneDate', () => {
    const dateProps = observationPage
            .props
            .content
            .props
            .children[1]
            .props
            .children[0] // done by
            .props
            .children[0]
            .props
            .children[2]
            .props

    assert(moment(dateProps.value, DATE_FORMAT_DISPLAY, true).isValid())
  })

  it('should set default date and have correct date format for registeredBy', () => {
    const dateProps = observationPage
            .props
            .content
            .props
            .children[1]
            .props
            .children[1] // registered by
            .props
            .children[0]
            .props
            .children[2]
            .props

    assert(moment(dateProps.value, DATE_FORMAT_DISPLAY, true).isValid())
  })
})
