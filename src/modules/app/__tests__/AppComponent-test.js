import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import sinon from 'sinon';
import { AppComponent } from '../AppComponent';
import { AppSession } from '../appSession';
import MuseumId from '../../../models/museumId';
import ColletionId from '../../../models/collectionId';

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
        enableAnalysis={true}
        count={{ value: 0 }}
        appSession={
          new AppSession({
            accessToken: '1234',
            museumId: new MuseumId(99),
            collectionId: new ColletionId('00000000-0000-0000-0000-000000000000'),
            buildInfo: {
              buildInfoBuildNumber: '64'
            },
            groups: [],
            actor: {
              dataportenId: '1234',
              fn: 'Jarl'
            }
          })
        }
        scanner={{}}
        isScannerActive={sinon.spy()}
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
      >
        <span>Yay</span>
      </AppComponent>
    );
    expect(loadAppSession.calledOnce).toBe(true);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
