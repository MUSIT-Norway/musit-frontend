import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import sinon from 'sinon';
import { AppComponent } from '../AppComponent';

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
    const clearSearchStore = sinon.spy();
    const toggleEnabled = sinon.spy();
    const wrapper = shallow(
      <AppComponent
        enableAnalysis={true}
        count={{ value: 0 }}
        appSession={{
          accessToken: '1234',
          museumId: 99,
          collectionId: '00000000-0000-0000-0000-000000000000',
          buildInfo: {
            commitSha: '813e993f1d1bdaa7b60daa66d75e1957de4c6e2b'
          },
          groups: [],
          actor: {
            dataportenId: '1234',
            fn: 'Jarl'
          }
        }}
        scanner={{}}
        isScannerActive={sinon.spy()}
        clearSearchStore={clearSearchStore}
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
        clearObjectPicklist={a => a}
        clearNodePicklist={a => a}
        featureToggles={{ administrationPage: true }}
      >
        <span>Yay</span>
      </AppComponent>
    );
    expect(loadAppSession.calledOnce).toBe(true);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
