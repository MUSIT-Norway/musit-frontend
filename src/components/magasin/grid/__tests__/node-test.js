import assert from 'assert';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import NodeLeftMenuComponent from '../LeftMenu';

describe('NodeLeftMenuComponent', () => {
  let labels;
  let buttons;
  const setup = () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <NodeLeftMenuComponent
        rootNode={{ id: 1}}
        translate={(key) => key}
        onClickNewNode={(key) => key}
        objectsOnNode={11}
        totalObjectCount={78}
        underNodeCount={5}
        showButtons
        onClickProperties={(key) => key}
        onClickControlObservations={(key) => key}
        onClickObservations={(key) => key}
        onClickController={(key) => key}
        onClickMoveNode={(key) => key}
        onClickDelete={(key) => key}
      />
    );
    labels = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'label');
    buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'button');
  };
  it('Check the New newNode button is created.', () => {
    setup();
    assert(buttons[0].getAttribute('id') === '1_newNode');
  });
  it('Check the New properties button is created.', () => {
    setup();
    assert(buttons[1].getAttribute('id') === '1_properties');
  });
  it('Check the objectsOnNode label is created.', () => {
    setup();
    assert(labels[0].getAttribute('id') === '1_objectsOnNode');
  });
  it('Check the totalObjectCount label is created.', () => {
    setup();
    assert(labels[1].getAttribute('id') === '1_totalObjectCount');
  });
});
