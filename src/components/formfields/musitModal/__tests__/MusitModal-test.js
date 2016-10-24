import assert from 'assert'
import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import MusitModal from '../MusitModal';
import { Provider } from 'react-redux';

describe('MusitModal', () => {
  it('Check the div', () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <Provider
        store={mockStore({
          suggest: {}
        })}
      >
        <MusitModal
            show={Boolean(true)}
            onHide={(key) => key}
            onMove={(key) => key}
            headerText="Hi"
            loadChildren={(key) => key}
            clearPath={() => []}
            clearRoot={(key) => key}
            loadRoot={(key) => key}
            setCurrentId={(key) => key}
            clearCurrentId={(key) => key}
            rootNode={{}}
            translate={(key) => key}
            children={[{ id: 1, name: 'Museum', type: 'Building' }]}
            path={[{ id: 1, name: 'Museum', type: 'Building' }]}
        />
      </Provider>
    );
    const inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'div');
    assert(inputComponent[0].innerHTML === '<!-- react-empty: 2 -->')
  })
})
