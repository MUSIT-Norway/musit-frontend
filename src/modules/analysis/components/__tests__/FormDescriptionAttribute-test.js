// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import sinon from 'sinon';
import FormDescriptionAttribute from '../FormDescriptionAttribute';
import DescriptionAttributeInput from '../DescriptionAttributeInput';
import DescriptionAttributeSelect from '../DescriptionAttributeSelect';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('FormDescriptionAttribute', () => {
  it('should render DescriptionAttributeInput if no allowedValues', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(
      <FormDescriptionAttribute
        id="test"
        label="test label"
        labelWidth={2}
        elementWidth={3}
        onChange={onChange}
        value="ddddd"
        attr={{
          attributeKey: 'key',
          attributeType: 'type'
        }}
      />
    );
    expect(wrapper.find(DescriptionAttributeInput).length).toBe(1);
    expect(wrapper.find(DescriptionAttributeSelect).length).toBe(0);
  });

  it('should render DescriptionAttributeSelect if allowedValues', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(
      <FormDescriptionAttribute
        id="test"
        label="test label"
        labelWidth={2}
        elementWidth={3}
        onChange={onChange}
        value=""
        attr={{
          attributeKey: 'key',
          attributeType: 'type',
          allowedValues: [
            { id: 1, enLabel: '1', noLabel: '1' },
            { id: 2, enLabel: '2', noLabel: '2' }
          ]
        }}
      />
    );
    expect(wrapper.find(DescriptionAttributeInput).length).toBe(0);
    expect(wrapper.find(DescriptionAttributeSelect).length).toBe(1);
  });
});
