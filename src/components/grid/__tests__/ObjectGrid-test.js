import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json';
import React from 'react'
import ObjectGrid from '../ObjectGrid';

class TestModal extends React.Component {
  render() {
    return <span>Hello</span>
  }
}

class TestModalMoveHistory extends React.Component {
  render() {
    return <span>Hello</span>
  }
}

describe('ObjectGrid', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <ObjectGrid
        id={1}
        translate={(key) => key}
        MusitModal={TestModal}
        showMoveHistory={TestModalMoveHistory}
        onMove={(key) => key}
        refresh={(key) => key}
        onAction={() => true}
        tableData={[
          {
            id: 1,
            museumNo: 'C10001',
            subNo: '1',
            term: 'Gråstein'
          },
          {
            id: 1,
            museumNo: 'C10002',
            subNo: '2',
            term: 'Spydspiss'
          }
        ]}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  });
})
