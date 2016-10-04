import { assert, React, ReactTestUtils } from '../../../setup'
import ModalNodeGrid from 'components/grid/ModalNodeGrid'

describe('ModalNodeGrid', () => {
  let inputComponent
  before('should render ModalNodeGrid', () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <ModalNodeGrid
        onClick={(key) => key}
        tableData={[
          {
            name: 'Eske'
          },
          {
            name: 'Box'
          },
          {
            name: 'Room'
          }
        ]}
      />
    )
    inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'td')
  })

  it('Check that first row is created by id.', () => {
    assert(inputComponent[0].getAttribute('id') === '0_Eske')
  })
  it('Check that second row is created by id.', () => {
    assert(inputComponent[1].getAttribute('id') === '1_Box')
  })
  it('Check that third row is created by id.', () => {
    assert(inputComponent[2].getAttribute('id') === '2_Room')
  })
})
