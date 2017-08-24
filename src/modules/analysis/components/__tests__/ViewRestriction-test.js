// @flow
import React from 'react';
import ViewRestrictionComponent, { ViewRestriction } from '../ViewRestriction';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import sinon from 'sinon';
import { appSession } from '../../../../testutils/sampleDataForTest';
import CancelRestriction from '../CancelRestriction';

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

describe('ViewRestrictionComponent', () => {
  const clickCancel = sinon.spy();
  const updateRestriction = sinon.spy();
  const cancelRestriction = sinon.spy();
  const toggleCancelDialog = sinon.spy();

  it('should render restriction', () => {
    const showCancelDialog = false;

    const Comp = shallow(
      <ViewRestrictionComponent
        clickCancel={clickCancel}
        appSession={appSession}
        restriction={restriction}
        updateRestriction={updateRestriction}
        cancelRestriction={cancelRestriction}
        showCancelDialog={showCancelDialog}
        toggleCancelDialog={toggleCancelDialog}
        isRestrictionValidForCancellation={false}
      />
    );

    expect(Comp.find(ViewRestriction).length).toBe(1);
  });

  it('should render cancel dialog', () => {
    const showCancelDialog = true;

    const Comp = shallow(
      <ViewRestrictionComponent
        clickCancel={clickCancel}
        appSession={appSession}
        restriction={restriction}
        updateRestriction={updateRestriction}
        cancelRestriction={cancelRestriction}
        showCancelDialog={showCancelDialog}
        toggleCancelDialog={toggleCancelDialog}
        isRestrictionValidForCancellation={false}
      />
    );

    expect(Comp.find(ViewRestriction).length).toBe(0);
    expect(Comp.find(CancelRestriction).length).toBe(1);
    Comp.find(CancelRestriction).props().clickCancel();
    expect(cancelRestriction.calledOnce).toBe(true);
    expect(toggleCancelDialog.calledOnce).toBe(true);
  });
});

describe('ViewRestriction', () => {
  it('should render restriction', () => {
    const clickCancel = sinon.spy();

    const Comp = shallow(
      <ViewRestriction
        clickCancel={clickCancel}
        appSession={appSession}
        restriction={restriction}
      />
    );

    expect(shallowToJson(Comp)).toMatchSnapshot();
  });

  it('should call clickCancel when button is clicked', () => {
    const clickCancel = sinon.spy();
    const preventDefault = sinon.spy();

    const Comp = shallow(
      <ViewRestriction
        clickCancel={clickCancel}
        appSession={appSession}
        restriction={restriction}
      />
    );

    Comp.find('button').simulate('click', { preventDefault });
    expect(clickCancel.calledOnce).toBe(true);
    expect(preventDefault.calledOnce).toBe(true);
  });
});
