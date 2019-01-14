import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import SaveCancel from '../SaveCancel';
import sinon from 'sinon';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

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
    const onClickCancel = sinon.spy();
    const wrapper = shallow(
      <SaveCancel onClickCancel={onClickCancel} onClickSave={onClickSave} />
    );
    wrapper.find('.cancelButton').simulate('click');
    expect(onClickSave.calledOnce).toBe(false);
    expect(onClickCancel.calledOnce).toBe(true);
  });

  it('should react on clickSave', () => {
    const onClickSave = sinon.spy();
    const onClickCancel = sinon.spy();
    const wrapper = shallow(
      <SaveCancel onClickCancel={onClickCancel} onClickSave={onClickSave} />
    );
    wrapper.find('.submitButton').simulate('click');
    expect(onClickSave.calledOnce).toBe(true);
    expect(onClickCancel.calledOnce).toBe(false);
  });
});
