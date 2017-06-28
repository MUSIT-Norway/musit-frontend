// @flow

import React from 'react';

import { formatISOString } from '../../../../shared/util';
import { getArrField, getStrField } from '../../../../forms/form';
import DatePicker from '../../../../components/DatePicker';
import { ActorSuggest } from '../../../../components/suggest/ActorSuggest';
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

      const date = formatISOString(new Date());
      Comp.find(DatePicker).props().onChange(date);

      expect(updateForm.calledOnce).toBe(true);
      expect(updateForm.getCall(0).args[0]).toEqual({
        name: form.restrictions_expirationDate.name,
        rawValue: date
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

  describe('requester fields', () => {
    it('should update requesterName', () => {
      const appSession = sinon.spy();
      const updateForm = sinon.spy();
      const Comp = shallow(
        <Restriction form={form} updateForm={updateForm} appSession={appSession} />
      );
      const actor = {
        fn: 'Ola Nordmann'
      };
      Comp.find(ActorSuggest).props().onChange(actor);

      expect(updateForm.getCall(0).args[0]).toEqual({
        name: form.restrictions_requesterName.name,
        rawValue: actor.fn
      });
    });

    it('should update request id based from applicationId', () => {
      const appSession = sinon.spy();
      const updateForm = sinon.spy();
      const Comp = shallow(
        <Restriction form={form} updateForm={updateForm} appSession={appSession} />
      );
      const actor = {
        fn: 'Ola Nordmann',
        applicationId: '123'
      };
      Comp.find(ActorSuggest).props().onChange(actor);

      expect(updateForm.calledTwice);
      expect(updateForm.getCall(1).args[0]).toEqual({
        name: form.restrictions_requester.name,
        rawValue: actor.applicationId
      });
    });

    it('should update request id based from dataportenId', () => {
      const appSession = sinon.spy();
      const updateForm = sinon.spy();
      const Comp = shallow(
        <Restriction form={form} updateForm={updateForm} appSession={appSession} />
      );
      const actor = {
        fn: 'Ola Nordmann',
        dataportenId: '123'
      };
      Comp.find(ActorSuggest).props().onChange(actor);

      expect(updateForm.calledTwice);
      expect(updateForm.getCall(1).args[0]).toEqual({
        name: form.restrictions_requester.name,
        rawValue: actor.dataportenId
      });
    });
  });
});
