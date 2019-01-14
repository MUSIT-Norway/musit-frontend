// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import sinon from 'sinon';
import { getStrField } from '../../form';
import { FieldComboDropDownStr } from '../FieldComboDropDown';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('FieldComboDropDown', () => {
  const onChange = sinon.spy();

  const props = {
    field: getStrField('dropdownCombo'),
    title: 'Dropdown',
    onChange: onChange,
    selectItems: []
  };

  it('should not be null', () => {
    const wrapper = shallow(<FieldComboDropDownStr {...props} />);
    expect(wrapper).not.toBe(null);
  });
});
