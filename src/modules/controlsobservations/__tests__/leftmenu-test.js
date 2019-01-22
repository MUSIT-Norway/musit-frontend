import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import LeftMenu from '../EventsLeftMenu';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('LeftMenu', () => {
  it('Check the new observation button is created.', () => {
    const myDiv = shallow(
      <LeftMenu
        id="1"
        translate={key => key}
        onClickNewObservation={key => key}
        onClickNewControl={key => key}
        onClickSelectObservation={key => key}
        onClickSelectControl={key => key}
      />
    );
    expect(shallowToJson(myDiv)).toMatchSnapshot();
  });
});
