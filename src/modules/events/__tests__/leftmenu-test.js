import assert from 'assert';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import LeftMenu from '../EventsSideBar';

describe('LeftMenu', () => {
  let buttons;
  const setup = () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <LeftMenu
        id={1}
        translate={(key) => key}
        selectObservation={(key) => key}
        selectControl={(key) => key}
        onClickNewObservation={(key) => key}
        onClickNewControl={(key) => key}
        onClickSelectObservation={(key) => key}
        onClickSelectControl={(key) => key}
      />
    );
    buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'button');
  };
  it('Check the new observation button is created.', () => {
    setup();
    assert(buttons[0].getAttribute('id') === '1_newObservation');
  });
  it('Check the new control button is created.', () => {
    setup();
    assert(buttons[1].getAttribute('id') === '1_newControl');
  });
});
