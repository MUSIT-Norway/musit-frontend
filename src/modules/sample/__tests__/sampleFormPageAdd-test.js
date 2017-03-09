import { mount } from 'enzyme';
import React from 'react';
import SampleAddComponent from '../SampleAddComponent';
import sinon from 'sinon';

describe('AnalysisSampleFormPageAdd', () => {

  it('should display correctly', () => {
    const updateForm = sinon.spy();
    const wrapper = mount(<SampleAddComponent
      form={{
        note: {
          name: 'note',
          rawValue: 'hei'
        },
        weight: {
          name: 'weight',
          rawValue: '1,23'
        },
        phone: {
          name: 'phone',
          rawValue: '11-23'
        }
      }}
      updateForm={updateForm}
    />);
    wrapper.find('.note').simulate('change', { target: {
      value: 'Heisann'
    }});
    expect(updateForm.getCall(0).args[0].name).toBe('note');
    expect(updateForm.getCall(0).args[0].rawValue).toBe('Heisann');
    wrapper.find('.weight').simulate('change', { target: {
      value: '1,45'
    }});
    expect(updateForm.getCall(1).args[0].name).toBe('weight');
    expect(updateForm.getCall(1).args[0].rawValue).toBe('1,45');
    wrapper.find('.phone').simulate('change', { target: {
      value: '12-33'
    }});
    expect(updateForm.getCall(2).args[0].name).toBe('phone');
    expect(updateForm.getCall(2).args[0].rawValue).toBe('12-33');
  });
});
