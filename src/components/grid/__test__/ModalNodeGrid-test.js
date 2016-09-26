import { assert, React, ReactTestUtils } from '../../../../test/setup';
import ModalNodeGrid from '../ModalNodeGrid';

describe('ModalNodeGrid 1', () => {
  let inputComponent;
  before('should render ModalNodeGrid', () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <ModalNodeGrid
        onClick={(key) => key}
        tableData={[
          {
            name: 'Eske'
          }
        ]}
      />
    );
    inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'td');
  });

  it('Check the value of first row second column.', () => {
    assert(inputComponent[0].getAttribute('id') === '0_Eske')
  })
})

describe('ModalNodeGrid 2', () => {
  let inputComponent;
  before('should render ModalNodeGrid 2', () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <ModalNodeGrid
        onClick={(key) => key}
        tableData={[
          {
            name: 'Room'
          }
        ]}
      />
    );
    inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'td');
  });

  it('Check the value of first row second column.', () => {
    assert(inputComponent[0].getAttribute('id') === '0_Room')
  })
})
