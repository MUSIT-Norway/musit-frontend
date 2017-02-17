import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import sinon from 'sinon';
import { AppComponent } from '../AppComponent';
import { AppSession } from '../appSession';

describe('AppComponent', () => {
  it('remders', () => {
    const prepareSearch = sinon.spy();
    const setMuseumId = sinon.spy();
    const setCollectionId = sinon.spy();
    const loadAppSession = sinon.spy();
    const scanForNodeOrObject = sinon.spy();
    const goTo = sinon.spy();
    const clearBuffer = sinon.spy();
    const clearObjects = sinon.spy();
    const clearNodes = sinon.spy();
    const toggleEnabled = sinon.spy();
    const wrapper = shallow(
      <AppComponent
        appSession={new AppSession({
          accessToken: '1234',
          buildInfo: {
            buildInfoBuildNumber: '64'
          },
          groups: [],
          actor: {
            dataportenId: '1234',
            fn: 'Jarl'
          }
        })}
        scanner={{}}
        prepareSearch={prepareSearch}
        setMuseumId={setMuseumId}
        setCollectionId={setCollectionId}
        loadAppSession={loadAppSession}
        pickList={{
          nodes: [
            {
              marked: false,
              value: {},
              path: []
            }
          ],
          objects: [
            {
              marked: false,
              value: {},
              path: []
            },
            {
              marked: false,
              value: {},
              path: []
            }
          ]
        }}
        scanForNodeOrObject={scanForNodeOrObject}
        goTo={goTo}
        clearBuffer={clearBuffer}
        clearObjects={clearObjects}
        clearNodes={clearNodes}
        toggleEnabled={toggleEnabled}
      >
        <span>Yay</span>
      </AppComponent>
    );
    expect(loadAppSession.calledOnce).toBe(true);
    wrapper.find('.toggleScanner').simulate('click', { preventDefault: () => true});
    expect(toggleEnabled.calledOnce).toBe(true);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});