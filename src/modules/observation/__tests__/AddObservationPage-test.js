import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import { AddObservationPage } from '../AddObservationPage';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Render add observation page', () => {
  it('should set default date and have correct date format', () => {
    const addObservation = sinon.spy();
    const loadRootNode = sinon.spy();
    const emitError = sinon.spy();
    const emitSuccess = sinon.spy();
    shallow(
      <AddObservationPage
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
          museumId: 99,
          actor: { dataportenId: '12345', fn: 'Jarl' }
        }}
        emitSuccess={emitSuccess}
        emitError={emitError}
        loadRootNode={loadRootNode}
        doneDate="2017-02-08T11:14:25.889Z"
        addObservation={addObservation}
        mode="ADD"
        id="1"
      />
    );
    expect(loadRootNode.callCount).toBe(1);
  });
});
