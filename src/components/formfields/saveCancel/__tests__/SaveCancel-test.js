import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import SaveCancel from '../SaveCancel';
import sinon from 'sinon';
import ReactTestUtils from 'react-addons-test-utils';


describe('SaveCancel snapshot', () => {


  it('should match snapshot', () => {
    const onClickSave = sinon.spy();
    const wrapper = shallow(
      <SaveCancel
        id="2"
        saveLabel="Hii"
        onClickSave={onClickSave}
        cancelDisabled={true}
      />
    );

    expect(wrapper.find('.cancelButton').hasClass('disabled')).toEqual(false);
    expect(shallowToJson(wrapper)).toMatchSnapshot();

  });

  it('should react on clickCancel', () => {
    const onClickSave = sinon.spy();
    const onClickCancel= sinon.spy();
    const wrapper = shallow(
      <SaveCancel onClickCancel={onClickCancel} onClickSave={onClickSave}/>
    );
    wrapper.find('.cancelButton').simulate('click');
    expect(onClickSave.calledOnce).toBe(false);
    expect(onClickCancel.calledOnce).toBe(true);

  });
  it('should react on clickSave', () => {
    const onClickSave = sinon.spy();
    const onClickCancel= sinon.spy();
    const wrapper = shallow(
      <SaveCancel onClickCancel={onClickCancel} onClickSave={onClickSave}/>
    );
    wrapper.find('.submitButton').simulate('click');
    expect(onClickSave.calledOnce).toBe(true);
    expect(onClickCancel.calledOnce).toBe(false);
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

