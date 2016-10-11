import { assert, React, ReactTestUtils } from '../../../../test/setup';
import NodeGrid from '../NodeGrid';

const TestModal = () => <span>Hello</span>

describe('NodeGrid', () => {
  let inputComponent;
  const setup = () => {
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
    );
    inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'td');
  };

  it('Check the first row first column is created.', () => {
    setup()
    assert(inputComponent[0].getAttribute('id') === '1_Eske_StorageUnit_nodeName')
  })
  it('Check the first row second column is created.', () => {
    setup()
    assert(inputComponent[1].getAttribute('id') === '1_Eske_StorageUnit_nodeType')
  })
  it('Check the value of first row second column.', () => {
    setup()
    assert(inputComponent[1].innerHTML === 'musit.grid.node.nodeTypeItems.StorageUnit')
  })
  it('Check the value of second row second column.', () => {
    setup()
    assert(inputComponent[9].innerHTML === 'musit.grid.node.nodeTypeItems.StorageUnit')
  })
  it('Check the value of second row fourth column.', () => {
    setup()
    assert(inputComponent[11].innerHTML === '16')
  })
})
