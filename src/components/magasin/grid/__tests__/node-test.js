import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import NodeLeftMenuComponent from '../LeftMenu';

describe('SideBar', () => {

  it('renders properly', () => {
    const wrapper = shallow(
      <NodeLeftMenuComponent
        rootNode={{ id: 1}}
        translate={(key) => key}
        onClickNewNode={(key) => key}
        stats={{
          numNodes: 11,
          numObjects: 5,
          totalObjects: 78
        }}
        showButtons
        onClickProperties={(key) => key}
        onClickControlObservations={(key) => key}
        onClickObservations={(key) => key}
        onClickController={(key) => key}
        onClickMoveNode={(key) => key}
        onClickDelete={(key) => key}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
