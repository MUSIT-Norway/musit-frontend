import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Fontawesome from 'react-fontawesome';
import ObjectTable from '../ObjectTable';
import { Tr } from 'reactable';

describe('ObjectTable', () => {
  it('should display no objects message if no objects', () => {
    const wrapper = shallow(<ObjectTable objects={[]} />);
    expect(wrapper.contains(<span className="no-data">Ingen objekter å vise</span>)).toBe(
      true
    );
  });
  it('should display objects and samples if provided objects', () => {
    const wrapper = shallow(
      <ObjectTable
        objects={[
          {
            sampleNum: 1,
            museumNo: 'Test',
            term: 'Fisk',
            subNo: '34',
            sampleType: 'Kokko',
            sampleSubType: 'Mink'
          },
          { museumNo: 'Test', term: 'Fisk', subNo: '34' }
        ]}
      />
    );
    expect(
      wrapper.contains(<span className="no-data">No objects to display</span>)
    ).not.toBe(true);
    expect(wrapper.find(Tr).length).toEqual(2);
    expect(wrapper.contains(<Fontawesome name="flask" />)).toBe(true);
    expect(wrapper.contains(<span className="icon icon-musitobject" />)).toBe(true);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
