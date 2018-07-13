import React from 'react';
import { shallow } from 'enzyme';
import { CheckBox } from '../CheckBox';
import { shallowToJson } from 'enzyme-to-json';
import sinon from 'sinon';

describe('Test for checkBox component.', () => {
  it('Snapshot test for checkBox component', () => {
    const checkbox = shallow(
      <CheckBox id="TestId" checked={true} displayValue="Hello" onChange={e => e} />
    );
    expect(shallowToJson(checkbox)).toMatchSnapshot();
  });

  it('CheckBox onChange event', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(
      <CheckBox id="TestId2" checked={false} displayValue="Hello" onChange={onChange} />
    );
    const comp = wrapper.find('.checkBoxComponent');
    comp.simulate('change');

    expect(onChange.calledOnce).toBe(true);
    expect(comp.node.props.id).toBe('TestId2');
  });

  it('Render CheckBox text', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(
      <CheckBox id="TestId2" checked={false} displayValue="Hello" onChange={onChange} />
    );
    expect(wrapper.text()).toBe('Hello');
  });
});
