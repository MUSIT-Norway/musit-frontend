// @flow

import React from 'react';

import { getArrField, getStrField } from '../../../../forms/form';
import DatePicker from '../../../../components/DatePicker';
import Restriction from '../Restrictions';
import { shallow } from 'enzyme';
import sinon from 'sinon';

declare var describe: any;
declare var it: any;
declare var expect: any;

describe('Restriction component', () => {
  const form = {
    restrictions_requesterName: getStrField('name'),
    restrictions_requester: getStrField('requester'),
    restrictions_caseNumbers: getArrField('caseNumbers'),
    restrictions_reason: getStrField('reason'),
    restrictions_expirationDate: getStrField('date')
  };

  it('should call updateForm for reason field', () => {
    const appSession = sinon.spy();
    const updateForm = sinon.spy();
    const Comp = shallow(
      <Restriction form={form} updateForm={updateForm} appSession={appSession} />
    );

    const expectedValue = 'res text';
    Comp.find('#restrictionCause').simulate('change', {
      target: { value: expectedValue }
    });

    expect(updateForm.calledOnce).toBe(true);
    expect(updateForm.getCall(0).args[0]).toEqual({
      name: form.restrictions_reason.name,
      rawValue: expectedValue
    });
  });

  describe('expiration date field', () => {
    it('should sett form value to null when clearing date', () => {
      const appSession = sinon.spy();
      const updateForm = sinon.spy();
      const Comp = shallow(
        <Restriction form={form} updateForm={updateForm} appSession={appSession} />
      );

      Comp.find(DatePicker).props().onClear();

      expect(updateForm.calledOnce).toBe(true);
      expect(updateForm.getCall(0).args[0]).toEqual({
        name: form.restrictions_expirationDate.name,
        rawValue: null
      });
    });

    it('should update form value with the date when its valid', () => {
      const appSession = sinon.spy();
      const updateForm = sinon.spy();
      const Comp = shallow(
        <Restriction form={form} updateForm={updateForm} appSession={appSession} />
      );

      Comp.find(DatePicker).props().onChange('2017-06-14T00:00:00.000+02:00');

      expect(updateForm.calledOnce).toBe(true);
      expect(updateForm.getCall(0).args[0]).toEqual({
        name: form.restrictions_expirationDate.name,
        rawValue: '2017-06-14T00:00:00.000+02:00'
      });
    });

    it('should not trigger update form value when the date is invalid', () => {
      const appSession = sinon.spy();
      const updateForm = sinon.spy();
      const Comp = shallow(
        <Restriction form={form} updateForm={updateForm} appSession={appSession} />
      );

      Comp.find(DatePicker).props().onChange('Invalid date');

      expect(updateForm.notCalled).toBe(true);
    });
  });
});
