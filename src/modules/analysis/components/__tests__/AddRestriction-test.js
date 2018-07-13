// @flow
import React from 'react';
import AddRestriction from '../AddRestriction';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { appSession } from '../../../../testutils/sampleDataForTest';
import DatePicker from '../../../../components/DatePicker';
import { formatISOString } from '../../../../shared/util';
import StatefulActorSuggest from '../StatefulActorSuggest';

describe('AddRestriction', () => {
  describe('reason', () => {
    const restriction = {
      reason: 'Initial reason'
    };

    it('should render reason', () => {
      const updateRestriction = sinon.spy();

      const Comp = shallow(
        <AddRestriction
          updateRestriction={updateRestriction}
          appSession={appSession}
          restriction={restriction}
        />
      );

      expect(Comp.find('#restrictionCause').props().value).toEqual('Initial reason');
    });

    it('should call updateRestriction for reason field', () => {
      const updateRestriction = sinon.spy();

      const Comp = shallow(
        <AddRestriction
          updateRestriction={updateRestriction}
          appSession={appSession}
          restriction={restriction}
        />
      );

      const expectedValue = 'Updated reason';
      Comp.find('#restrictionCause').simulate('change', {
        target: { value: expectedValue }
      });

      expect(updateRestriction.calledOnce).toBe(true);
      expect(updateRestriction.getCall(0).args[0]).toEqual({
        reason: expectedValue
      });
    });
  });

  describe('expiration date', () => {
    const restriction = {
      expirationDate: '2017-08-21T07:21:23+00:00'
    };

    it('should render date value', () => {
      const updateRestriction = sinon.spy();

      const Comp = shallow(
        <AddRestriction
          updateRestriction={updateRestriction}
          appSession={appSession}
          restriction={restriction}
        />
      );

      expect(Comp.find(DatePicker).props().value).toEqual('2017-08-21T07:21:23+00:00');
    });

    it('should set form value to null when clearing date', () => {
      const updateRestriction = sinon.spy();

      const Comp = shallow(
        <AddRestriction
          updateRestriction={updateRestriction}
          appSession={appSession}
          restriction={restriction}
        />
      );

      Comp.find(DatePicker)
        .props()
        .onClear();

      expect(updateRestriction.calledOnce).toBe(true);
      expect(updateRestriction.getCall(0).args[0]).toEqual({
        expirationDate: null
      });
    });

    it('should update form value with the date when its valid', () => {
      const updateRestriction = sinon.spy();

      const Comp = shallow(
        <AddRestriction
          updateRestriction={updateRestriction}
          appSession={appSession}
          restriction={restriction}
        />
      );

      const date = formatISOString(new Date());
      Comp.find(DatePicker)
        .props()
        .onChange(date);

      expect(updateRestriction.calledOnce).toBe(true);
      expect(updateRestriction.getCall(0).args[0]).toEqual({
        expirationDate: date
      });
    });

    it('should not trigger update form value when the date is invalid', () => {
      const updateRestriction = sinon.spy();

      const Comp = shallow(
        <AddRestriction
          updateRestriction={updateRestriction}
          appSession={appSession}
          restriction={restriction}
        />
      );

      Comp.find(DatePicker)
        .props()
        .onChange('Invalid date');

      expect(updateRestriction.notCalled).toBe(true);
    });
  });

  describe('caseNumbers', () => {
    it('should render the case numbers in the input value', () => {
      const updateRestriction = sinon.spy();

      const Comp = shallow(
        <AddRestriction
          updateRestriction={updateRestriction}
          appSession={appSession}
          restriction={{
            caseNumbers: ['this', 'is', 'it']
          }}
        />
      );

      expect(Comp.find('#restrictionCaseNumbers').props().value).toEqual('this, is, it');
    });

    it('should handle empty string', () => {
      const updateRestriction = sinon.spy();

      const Comp = shallow(
        <AddRestriction
          updateRestriction={updateRestriction}
          appSession={appSession}
          restriction={{}}
        />
      );

      Comp.find('#restrictionCaseNumbers')
        .props()
        .onChange({ target: { value: '' } });
      expect(Comp.find('#restrictionCaseNumbers').props().value).toEqual('');

      expect(updateRestriction.calledOnce).toBe(true);
      expect(updateRestriction.getCall(0).args[0]).toEqual({
        caseNumbers: []
      });
    });

    it('should split comma separated string and trim values', () => {
      const updateRestriction = sinon.spy();

      const Comp = shallow(
        <AddRestriction
          updateRestriction={updateRestriction}
          appSession={appSession}
          restriction={{}}
        />
      );

      Comp.find('#restrictionCaseNumbers')
        .props()
        .onChange({ target: { value: 'this,  is  , some  , case numbers    ' } });

      expect(updateRestriction.calledOnce).toBe(true);
      expect(updateRestriction.getCall(0).args[0]).toEqual({
        caseNumbers: ['this', 'is', 'some', 'case numbers']
      });
    });
  });

  describe('requester', () => {
    const restriction = {
      requester: null
    };

    it('should render requester name', () => {
      const updateRestriction = sinon.spy();

      const Comp = shallow(
        <AddRestriction
          updateRestriction={updateRestriction}
          appSession={appSession}
          restriction={{
            requesterName: 'Ola wierdo'
          }}
        />
      );

      expect(Comp.find(StatefulActorSuggest).props().value).toEqual('Ola wierdo');
    });

    it('should call updateRestriction on onChange', () => {
      const updateRestriction = sinon.spy();

      const Comp = shallow(
        <AddRestriction
          updateRestriction={updateRestriction}
          appSession={appSession}
          restriction={restriction}
        />
      );

      const actor = {
        fn: 'Ola Nordmann',
        applicationId: 'a50da1c5-9359-4b42-b94a-8faa04ff95cd'
      };

      Comp.find(StatefulActorSuggest)
        .props()
        .onChange(actor.applicationId);

      expect(updateRestriction.calledOnce).toBe(true);
      expect(updateRestriction.getCall(0).args[0]).toEqual({
        requester: actor.applicationId
      });
    });
  });
});
