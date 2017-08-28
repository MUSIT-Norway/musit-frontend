// @flow
import React from 'react';
import CancelRestriction from '../CancelRestriction';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import sinon from 'sinon';
import { appSession } from '../../../../testutils/sampleDataForTest';
import { FormElement } from '../../../../forms/components';
import StatefulActorSuggest from '../../components/StatefulActorSuggest';

declare var describe: any;
declare var it: any;
declare var expect: any;

const restriction = {
  reason: 'Initial reason',
  expirationDate: '2017-08-21T08:17:03+00:00',
  caseNumbers: ['This', 'is', 'not', 'it'],
  requester: 'a50da1c5-9359-4b42-b94a-8faa04ff95cd',
  requesterName: 'dummy user',
  registeredStamp: {
    user: 'a50da1c5-9359-4b42-b94a-8faa04ff95cd',
    date: '2017-08-21T08:17:03+00:00'
  }
};

describe('CancelRestriction', () => {
  it('should render cancel reason and cancelledByName', () => {
    const clickCancel = sinon.spy();
    const updateRestriction = sinon.spy();

    const Comp = shallow(
      <CancelRestriction
        clickCancel={clickCancel}
        appSession={appSession}
        restriction={{
          ...restriction,
          cancelledReason: 'Cancel thizz',
          cancelledStamp: {
            user: 'a50da1c5-9359-4b42-b94a-8faa04ff95cd',
            date: '2017-08-21T08:17:03+00:00'
          },
          cancelledByName: 'Dummy userrr'
        }}
        updateRestriction={updateRestriction}
        isRestrictionValidForCancellation={false}
      />
    );

    expect(Comp.find('button').length).toBe(0);

    expect(shallowToJson(Comp)).toMatchSnapshot();
  });

  it('should call clickCancel when button is clicked', () => {
    const clickCancel = sinon.spy();
    const updateRestriction = sinon.spy();
    const preventDefault = sinon.spy();

    const Comp = shallow(
      <CancelRestriction
        clickCancel={clickCancel}
        appSession={appSession}
        restriction={restriction}
        updateRestriction={updateRestriction}
        isRestrictionValidForCancellation={false}
      />
    );

    Comp.find('button').simulate('click', { preventDefault });
    expect(preventDefault.calledOnce).toBe(true);
    expect(clickCancel.calledOnce).toBe(true);
  });

  it('should call updateRestriction when cancelled by is updated', () => {
    const clickCancel = sinon.spy();
    const updateRestriction = sinon.spy();

    const Comp = shallow(
      <CancelRestriction
        clickCancel={clickCancel}
        appSession={appSession}
        restriction={restriction}
        updateRestriction={updateRestriction}
        isRestrictionValidForCancellation={false}
      />
    );

    Comp.find(StatefulActorSuggest)
      .props()
      .onChange('a50da1c5-9359-4b42-b94a-8faa04ff95cd');
    expect(updateRestriction.calledOnce).toBe(true);
    expect(updateRestriction.getCall(0).args[0]).toEqual({
      ...restriction,
      cancelledBy: 'a50da1c5-9359-4b42-b94a-8faa04ff95cd'
    });
  });

  it('should call updateRestriction when cancelled reason is updated', () => {
    const clickCancel = sinon.spy();
    const updateRestriction = sinon.spy();

    const Comp = shallow(
      <CancelRestriction
        clickCancel={clickCancel}
        appSession={appSession}
        restriction={restriction}
        updateRestriction={updateRestriction}
        isRestrictionValidForCancellation={false}
      />
    );

    Comp.find('input#cancelCause').simulate('change', {
      target: { value: 'Some weird cause' }
    });
    expect(updateRestriction.calledOnce).toBe(true);
    expect(updateRestriction.getCall(0).args[0]).toEqual({
      ...restriction,
      cancelledReason: 'Some weird cause'
    });
  });
});
