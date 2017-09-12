// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import sinon from 'sinon';
import DescriptionAttributeSelect from '../DescriptionAttributeSelect';

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

it('should render allowedValues', () => {
  const onChange = sinon.spy();
  const wrapper = shallow(
    <DescriptionAttributeSelect
      attr={{
        attributeKey: 'key',
        attributeType: 'type',
        allowedValues: [
          { id: 1, enLabel: 'Fish', noLabel: 'Fisk' },
          { id: 2, enLabel: 'car', noLabel: 'bil' }
        ]
      }}
      value=""
      onChange={onChange}
    />
  );
  const options = wrapper.find('option');
  expect(options.length).toBe(3);
  expect(options.getNodes()[1].props.value).toBe(1);
  expect(options.getNodes()[1].props.children.props.en).toBe('Fish');
  expect(options.getNodes()[1].props.children.props.no).toBe('Fisk');
  expect(options.getNodes()[2].props.value).toBe(2);
  expect(options.getNodes()[2].props.children.props.en).toBe('car');
  expect(options.getNodes()[2].props.children.props.no).toBe('bil');
  expect(wrapper.find('select').props().name).toEqual('key');
});
