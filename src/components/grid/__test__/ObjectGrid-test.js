import { assert, React, ReactTestUtils } from '../../../../test/setup';
import ObjectGrid from '../ObjectGrid';

describe('ObjectGrid', () => {
  let inputComponent;

  before('should render ObjectGrid', () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <ObjectGrid
        id={1}
        translate={(key) => key}
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
  });

  it('Check the 1st row Museum number id.', () => {
    assert(inputComponent[0].getAttribute('id') === '1_C10001_1_museumNumber')
  })
  it('Check the 1st row Unr id', () => {
    assert(inputComponent[1].getAttribute('id') === '1_C10001_1_uNumber')
  })
  it('Check the 1st row Unr value', () => {
    assert(inputComponent[1].innerHTML === '1')
  })
  it('Check the 1st row Term value', () => {
    assert(inputComponent[2].innerHTML === 'Gråstein')
  })
  it('Check the 2nd row Unr value', () => {
    assert(inputComponent[6].innerHTML === '2')
  })
  it('Check the 2nd row Term value', () => {
    assert(inputComponent[7].innerHTML === 'Spydspiss')
  })
})
