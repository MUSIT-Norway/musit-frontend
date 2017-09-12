// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import ObjectAndSampleDetails from '../ObjectAndSampleDetails';
import { history, appSession, sample } from '../../../../testutils/sampleDataForTest';
import NavigateToObject from '../../../../components/navigations/NavigateToObject';

describe('ObjectAndSampleDetails', () => {
  it('should not be null', () => {
    const objectData = {
      id: 1,
      uuid: 'whatever',
      museumId: 23,
      museumNo: 'MUSK123',
      subNo: '23',
      term: 'Fishy fish',
      currentLocation: { pathNames: [] },
      objectType: 'collection',
      nodeId: '',
      derivedFrom: sample
    };
    const wrapper = shallow(
      <ObjectAndSampleDetails
        history={history}
        appSession={appSession}
        objectData={objectData}
      />
    );
    expect(
      wrapper.contains(
        <span style={{ marginRight: 20 }}>
          <strong>Museumsnr.</strong> MUSK123
        </span>
      )
    ).toBe(true);
    expect(
      wrapper.contains(
        <span style={{ marginRight: 20 }}>
          <strong>Unr.</strong> 23
        </span>
      )
    ).toBe(true);
    expect(
      wrapper.contains(
        <span>
          <strong>Gjenstand/Takson</strong> Fishy fish
        </span>
      )
    ).toBe(true);
    expect(wrapper.find(NavigateToObject).props().objectId).toEqual('whatever');
    expect(wrapper.find(NavigateToObject).props().appSession).toEqual(appSession);
    expect(wrapper.find(NavigateToObject).props().history).toEqual(history);
    expect(wrapper.contains(<strong>Prøvenr.</strong>)).toBe(true);
    expect(wrapper.contains(<strong>Prøvetype</strong>)).toBe(true);
    expect(wrapper.contains(<strong>Prøveundertype</strong>)).toBe(true);
  });
});
