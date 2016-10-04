import { assert, React, ReactTestUtils } from '../../../setup'
import NodeGrid from 'components/grid/NodeGrid'

const TestModal = () => <span>Hello</span>

describe('NodeGrid', () => {
  let inputComponent
  before('should render NodeGrid', () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <NodeGrid
        id={1}
        translate={(key) => key}
        onAction={(key) => key}
        onClick={(key) => key}
        onMove={(key) => key}
        refresh={(key) => key}
        MusitModal={TestModal}
        tableData={[
          {
            id: 1,
            name: 'Eske',
            type: 'StorageUnit',
            objectCount: 0,
            totalObjectCount: 12,
            nodeCount: 0
          },
          {
            id: 2,
            name: 'Pose',
            type: 'StorageUnit',
            objectCount: 0,
            totalObjectCount: 16,
            nodeCount: 0
          }
        ]}
      />
    )
    inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'td')
  })

  it('Check the first row first column is created.', () => {
    assert(inputComponent[0].getAttribute('id') === '1_Eske_StorageUnit_nodeName')
  })
  it('Check the first row second column is created.', () => {
    assert(inputComponent[1].getAttribute('id') === '1_Eske_StorageUnit_nodeType')
  })
  it('Check the value of first row second column.', () => {
    assert(inputComponent[1].innerHTML === 'musit.grid.node.nodeTypeItems.StorageUnit')
  })
  it('Check the value of second row second column.', () => {
    assert(inputComponent[9].innerHTML === 'musit.grid.node.nodeTypeItems.StorageUnit')
  })
  it('Check the value of second row fourth column.', () => {
    assert(inputComponent[11].innerHTML === '16')
  })
})
