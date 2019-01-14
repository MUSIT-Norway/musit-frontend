import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import { EditObservationPage } from '../EditObservationPage';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Render edit observation page', () => {
  it('should set default date and have correct date format', () => {
    const addObservation = sinon.spy();
    const loadRootNode = sinon.spy();
    const emitError = sinon.spy();
    const emitSuccess = sinon.spy();
    shallow(
      <EditObservationPage
        goBack={() => {}}
        store={{
          rootNode: null
        }}
        match={{
          params: {
            id: '1'
          }
        }}
        appSession={{
          accessToken: '1234',
          museumId: 99
        }}
        location={{
          state: {
            doneBy: {
              dataportenId: '1223',
              fn: 'Dummy'
            }
          }
        }}
        emitSuccess={emitSuccess}
        emitError={emitError}
        doneDate="2017-02-08T11:14:25.889Z"
        addObservation={addObservation}
        loadRootNode={loadRootNode}
        mode="ADD"
        id="1"
      />
    );
    expect(loadRootNode.callCount).toBe(1);
  });
});
