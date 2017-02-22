import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import PickListComponent from '../PickListTable';
//import sinon from 'sinon';

describe('PickListTable overview', () => {
  it('should display object-picklist correctly', () => {
    const pics  = [];
    const marked = [];

    const wrapper = shallow(<PickListComponent
                              picks={pics}
                              marked={marked}
                              isnode={false}
                              move={(x) => x}
                              print={(p) => p}
                              toggle={(t)=> t}
                              remove={(r)=> r}
                              iconRendrer={(r)=> r}
                              labelRendrer={(l)=> l}
                              />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
