import { assert, React, ReactTestUtils } from '../../../../test/setup';
import ObjectGrid from '../ObjectGrid';

class TestModal extends React.Component {
  render() {
    return <span>Hello</span>
  }
}

class TestModalMoveHistory extends React.Component {
  render() {
    return <span>Hello</span>
  }
}

describe('ObjectGrid', () => {
  let inputComponent;

  const setup = () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <ObjectGrid
        id={1}
        translate={(key) => key}
        MusitModal={TestModal}
        showMoveHistory={TestModalMoveHistory}
        onMove={(key) => key}
        refresh={(key) => key}
        onAction={() => true}
        tableData={[
          {
            id: 1,
            identifier: {
              museumNo: 'C10001',
              subNo: '1',
            },
            displayName: 'Gråstein'
          },
          {
            id: 1,
            identifier: {
              museumNo: 'C10002',
              subNo: '2',
            },
            displayName: 'Spydspiss'
          }
        ]}
      />
    );
    inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'td');
  };

  it('Check the 1st row Museum number id.', () => {
    setup()
    assert(inputComponent[0].getAttribute('id') === '1_C10001_1_museumNumber')
  })
  it('Check the 1st row Unr id', () => {
    setup()
    assert(inputComponent[1].getAttribute('id') === '1_C10001_1_uNumber')
  })
  it('Check the 1st row Unr value', () => {
    setup()
    assert(inputComponent[1].innerHTML === '1')
  })
  it('Check the 1st row Term value', () => {
    setup()
    assert(inputComponent[2].innerHTML === 'Gråstein')
  })
  it('Check the 2nd row Unr value', () => {
    setup()
    assert(inputComponent[7].innerHTML === '2')
  })
  it('Check the 2nd row Term value', () => {
    setup()
    assert(inputComponent[8].innerHTML === 'Spydspiss')
  })
})
