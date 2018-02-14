// @flow
import React from 'react';
import { refreshSession, makeUrlAware } from '../appSession';
import sinon from 'sinon';
import { mount } from 'enzyme';

describe('makeUrlAware', () => {
  it('should work', () => {
    const Component = props => <span>{props.name}</span>;
    const EnhancedComponent = makeUrlAware(Component);
    const appSession = {
      museumId: 99,
      collectionId: '1234',
      actor: {
        ataportenUser: 'abc@abc.com'
      }
    };
    const wrapper = mount(
      <EnhancedComponent
        appSession={appSession}
        match={{ museumId: '99', collectionId: '1234' }}
      />
    );
    wrapper.setProps({ appSession });
    expect(wrapper).not.toBe(null);
  });
});

describe('RefreshSession', () => {
  let setMuseumId;
  let setCollectionId;

  beforeEach(() => {
    setMuseumId = sinon.spy();
    setCollectionId = sinon.spy();
  });

  it('It should refresh session if match values is different.', () => {
    const params = {
      museumId: 98,
      collectionId: 'Vascular Plant'
    };
    const appSession = {
      museumId: 99,
      collectionId: 'Lichens',
      actor: {
        ataportenUser: 'abc@abc.com'
      }
    };
    refreshSession(setMuseumId, setCollectionId)(params, appSession);
    expect(setMuseumId.calledOnce).toBe(true);
    expect(setMuseumId.getCall(0).args[0]).toBe(98);
    expect(setCollectionId.calledOnce).toBe(false);
  });

  it('It should NOT refresh museum if museumId is null.', () => {
    const match = {
      params: {
        museumId: null,
        collectionId: 'Vascular Plant'
      }
    };
    const appSession = {
      museumId: 99,
      collectionId: 'Lichens',
      actor: {
        ataportenUser: 'abc@abc.com'
      }
    };
    refreshSession(setMuseumId, setCollectionId)(match, appSession);
    expect(setMuseumId.calledOnce).toBe(false);
    expect(setCollectionId.calledOnce).toBe(false);
  });

  it('It should NOT refresh collection if collection is null.', () => {
    const match = {
      params: {
        museumId: null,
        collectionId: null
      }
    };
    const appSession = {
      museumId: 99,
      collectionId: 'Lichens',
      actor: {
        ataportenUser: 'abc@abc.com'
      }
    };
    refreshSession(setMuseumId, setCollectionId)(match, appSession);
    expect(setMuseumId.calledOnce).toBe(false);
    expect(setCollectionId.calledOnce).toBe(false);
  });

  it('It should NOT do anything if appSession is empty.', () => {
    const match = {
      params: {
        museumId: null,
        collectionId: null
      }
    };
    const appSession = {
      museumId: null,
      collectionId: null,
      actor: {
        ataportenUser: 'abc@abc.com'
      }
    };
    refreshSession(setMuseumId, setCollectionId)(match, appSession);
    expect(setMuseumId.calledOnce).toBe(false);
    expect(setCollectionId.calledOnce).toBe(false);
  });
});
