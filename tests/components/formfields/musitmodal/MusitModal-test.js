import assert from 'assert'
import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import MusitModal from '../../../../src/components/formfields/musitModal/MusitModal'

describe('MusitModal', () => {
  let inputComponent
  before('should render Musit Modal', () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <MusitModal
        show={Boolean(true)}
        onHide={(key) => key}
        onMove={(key) => key}
        headerText='Hi'
        loadChildren={(key) => key}
        loadPath={() => []}
        clearPath={() => []}
        loadRoot={(key) => key}
        setCurrentId={(key) => key}
        clearCurrentId={(key) => key}
        rootNode={{}}
        translate={(key) => key}
        children={[{ id: 1, name: 'Museum', type: 'Building' }]}
        path={[{ id: 1, name: 'Museum', type: 'Building' }]}
      />
    )
    inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'div')
  })

  it('Check the div', () => {
    assert(inputComponent[0].innerHTML === '<!-- react-empty: 2 -->')
  })
})
