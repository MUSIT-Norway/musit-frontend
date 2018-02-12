// @flow
import React from 'react';
import SingleObjectSelection from '../SingleObjectSelection';
import { shallow } from 'enzyme';

describe('SingleObjectSelection', () => {
  const wrapper = shallow(
    <SingleObjectSelection
      visible={true}
      affectedThingSubEventOnChange={() => 'hei'}
      affectedThingsWithDetailsMainEvent={[
        {
          id: 1,
          uuid: '0000-0001-0000-0000',
          objectType: 'collection',
          museumId: 99,
          term: 'Kniv',
          museumNo: 'KMN-1'
        },
        {
          id: 2,
          uuid: '0000-0002-0000-0000',
          objectType: 'collection',
          museumId: 99,
          term: 'Øks',
          museumNo: 'KMN-12'
        }
      ]}
    />
  );

  it('should have correct number of rows', () => {
    expect(wrapper.find('tbody').find('tr').length).toEqual(2);
  });
});
