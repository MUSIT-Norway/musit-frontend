// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import sinon from 'sinon';
import DescriptionAttributeInput from '../DescriptionAttributeInput';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('DescriptionAttributeInput', () => {
  it('should pass through change event', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(
      <DescriptionAttributeInput
        attr={{
          attributeKey: 'key',
          attributeType: 'type'
        }}
        value=""
        onChange={onChange}
      />
    );
    const event = { target: { value: 'Some value' } };
    wrapper.find('input').simulate('change', event);
    expect(onChange.calledOnce).toBe(true);
    expect(onChange.getCall(0).args[0]).toEqual(event); // pass through event
  });

  it('should accept array as value', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(
      <DescriptionAttributeInput
        attr={{
          attributeKey: 'key',
          attributeType: 'type'
        }}
        value={['1', '2', 3, 'four']}
        onChange={onChange}
      />
    );
    expect(wrapper.find('input').props().value).toEqual('1,2,3,four');
  });

  it('should set name on input element to the attributeKey', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(
      <DescriptionAttributeInput
        attr={{
          attributeKey: 'key',
          attributeType: 'type'
        }}
        value=""
        onChange={onChange}
      />
    );
    expect(wrapper.find('input').props().name).toEqual('key');
  });
});
