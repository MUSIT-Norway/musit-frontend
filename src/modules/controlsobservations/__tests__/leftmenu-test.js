import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import LeftMenu from '../EventsLeftMenu';

describe('LeftMenu', () => {
  it('Check the new observation button is created.', () => {
    const myDiv = shallow(
      <LeftMenu
        id={"1"}
        translate={(key) => key}
        selectObservation={(key) => key}
        selectControl={(key) => key}
        onClickNewObservation={(key) => key}
        onClickNewControl={(key) => key}
        onClickSelectObservation={(key) => key}
        onClickSelectControl={(key) => key}
      />
    );
    expect(shallowToJson(myDiv)).toMatchSnapshot();
  });
});
