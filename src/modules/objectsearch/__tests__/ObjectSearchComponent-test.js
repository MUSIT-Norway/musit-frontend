import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import { ObjectSearchComponent } from '../ObjectSearchComponent';
import { getPath } from '../../../shared/util';
import MusitObject from '../../../models/object';

describe('ObjectSearchComponent', () => {
  const path = ',1,2,3,';
  const pathNames = [
    {
      nodeId: 1,
      name: 'Root',
      type: 'Organization'
    },
    {
      nodeId: 2,
      name: 'Musit',
      type: 'Building'
    },
    {
      nodeId: 3,
      name: 'Kontoret',
      type: 'Room'
    }
  ];
  const testData = {
    totalMatches: 20,
    matches: Array(20).fill(new MusitObject(
      {
        museumNo: '12345',
        subNo: '45',
        term: 'Fuglekasse',
        id: 1,
        breadcrumb: getPath({ path, pathNames }),
        path: path,
        pathNames: pathNames
      }
    ))
  };

  it('should display object 1', () => {
    const wrapper = shallow(
      <ObjectSearchComponent
        store={{
          loaded: true,
          data: testData,
          params: {
            currentPage: 1,
            perPage: 5
          }
        }}
        onChangeField={() => true}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
