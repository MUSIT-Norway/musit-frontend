import { shallow } from 'enzyme';
import React from 'react';
import { SaveCancel } from '../formfields';
import sinon from 'sinon';

describe('ClickSaveCancel', () => {
  it('should react on click', () => {
    const onClickSave = sinon.spy();
    const onClickCancel= sinon.spy();
    const wrapper = shallow(
      <SaveCancel onClickCancel={onClickCancel} onClickSave={onClickSave}/>
    );
    const s = wrapper.children().first().children().first();
    const c = wrapper.children().last().children().last();
    s.simulate('click');
    c.simulate('click');
    expect(onClickSave.calledOnce).toBe(true);
    expect(onClickCancel.calledOnce).toBe(true);

  });
});