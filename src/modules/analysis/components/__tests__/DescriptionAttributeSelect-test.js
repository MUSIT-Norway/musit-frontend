// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import sinon from 'sinon';
import DescriptionAttributeSelect from '../DescriptionAttributeSelect';

declare var describe: any;
declare var it: any;
declare var expect: any;

describe('DescriptionAttributeSelect', () => {
  it('should pass through change event', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(
      <DescriptionAttributeSelect
        attr={{
          attributeKey: 'key',
          attributeType: 'type'
        }}
        value=""
        onChange={onChange}
      />
    );
    const event = { target: { value: 'Some value' } };
    wrapper.find('select').simulate('change', event);
    expect(onChange.calledOnce).toBe(true);
    expect(onChange.getCall(0).args[0]).toEqual(event); // pass through event
  });

  it('should accept array as value (but pretty useless....)', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(
      <DescriptionAttributeSelect
        attr={{
          attributeKey: 'key',
          attributeType: 'type'
        }}
        value={['1', '2', 3, 'four']}
        onChange={onChange}
      />
    );
    expect(wrapper.find('select').props().defaultValue).toEqual('1,2,3,four');
  });

  it('should set name on input element to the attributeKey', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(
      <DescriptionAttributeSelect
        attr={{
          attributeKey: 'key',
          attributeType: 'type'
        }}
        value=""
        onChange={onChange}
      />
    );
    expect(wrapper.find('select').props().name).toEqual('key');
  });
});
