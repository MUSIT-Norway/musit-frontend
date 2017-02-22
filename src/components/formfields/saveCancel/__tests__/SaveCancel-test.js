import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import SaveCancel from '../SaveCancel';
import sinon from 'sinon';
import ReactTestUtils from 'react-addons-test-utils';

// 1. save disabled 2. save not disabled + clicking 3. etc etc

describe('SaveCancel snapshot', () => {
  const onClickSave = sinon.spy();
  const onClickCancel = sinon.spy();

  it('should match snapshot', () => {
    const wrapper = shallow(
      <SaveCancel
        onClickSave={onClickSave}
        onClickCancel={onClickCancel}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();

  });

});


describe('SaveCancel', () => {
  let SaveButton;
  let CancelButton;

  beforeEach(() => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <SaveCancel
        id="1"
        onClickSave={(a) => (a)}
        onClickCancel={(a) => (a)}
        saveDisabled={false}
        cancelDisabled={true}
      />
    );
    const inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'button');
    SaveButton = inputComponent[0];

    CancelButton = inputComponent[1];
    // console.log(CancelButton);
  });

  it('Check the SaveButton button is created', () => {
    expect(SaveButton.getAttribute('type')).toBe('button');
    expect(SaveButton.innerHTML).toBe('Lagre');
  });

  it('Check the CancelButton component is created', () => {
    expect(CancelButton.getAttribute('type')).toBe('button');
  });

  it('Check the CancelButton component is disabled', () => {
    expect(SaveButton.getAttribute('disabled')).toBe(null);
  });
});

