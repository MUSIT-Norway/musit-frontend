// @flow

import React from 'react';

import { getArrField, getStrField } from '../../../../forms/form';
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
});
