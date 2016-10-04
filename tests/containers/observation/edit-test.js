import assert from 'assert'
import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import ObservationPage from '../../../src/containers/observation/page'
import { parseISODateNonStrict as parseISODate } from '../../../src/utils'

describe('Render edit observation page', () => {
  const renderer = ReactTestUtils.createRenderer()
  let observationPage

  beforeEach(() => {
    renderer.render(
      <ObservationPage
        translate={(key) => key}
        params={{ }}
        onSaveObservation={() => true}
        doneDate={parseISODate('2016-12-23')}
        mode='EDIT'
        id='1'
      />
    )
    observationPage = renderer.getRenderOutput()
  })

  it('should set default date and have correct date format', () => {
    const dateProps = observationPage
            .props
            .children
            .props
            .children[0]
            .props
            .children[1]
            .props
            .children[0]
            .props
            .children[1]
            .props

    assert(dateProps.value === '23.12.2016')
    assert(dateProps.disabled === true)
  })
})
