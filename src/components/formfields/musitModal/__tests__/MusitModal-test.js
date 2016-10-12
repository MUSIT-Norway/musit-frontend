import { assert, React, ReactTestUtils } from '../../../../../test/setup';
import MusitModal from '../MusitModal';

describe('MusitModal', () => {
  it('Check the div', () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
        <MusitModal
            show={Boolean(true)}
            onHide={(key) => key}
            onMove={(key) => key}
            headerText="Hi"
            loadChildren={(key) => key}
            loadPath={() => []}
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
    );
    let inputComponent = ReactTestUtils.scryRenderedDOMComponentsWithTag(myDiv, 'div');
    assert(inputComponent[0].innerHTML === '<!-- react-empty: 2 -->')
  })
})
