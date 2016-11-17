import assert from 'assert';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import ModalNodeGrid from '../ModalNodeGrid';

describe('ModalNodeGrid', () => {
  let inputComponent;
  const setup = () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <ModalNodeGrid
        onClick={(key) => key}
        tableData={[
          {
            name: 'Eske',
            type: 'StorageUnit'
          },
          {
            name: 'Box',
            type: 'StorageUnit'
          },
          {
            name: 'Room',
            type: 'Room'
          }
        ]}
      />
    );
    inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'td');
  };

  it('Check that first row is created by id.', () => {
    setup();
    assert(inputComponent[0].getAttribute('id') === '0_Eske');
  });
  it('Check that second row is created by id.', () => {
    setup();
    assert(inputComponent[2].getAttribute('id') === '1_Box');
  });
  it('Check that third row is created by id.', () => {
    setup();
    assert(inputComponent[5].getAttribute('id') === '2_Room');
  });
});
