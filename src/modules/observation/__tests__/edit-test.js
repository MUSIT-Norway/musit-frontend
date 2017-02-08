import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import ObservationPage from '../ObservationPage';
import MusitActor from '../../../models/actor';

describe('Render edit observation page', () => {
  it('should set default date and have correct date format', () => {
    const observationPage = shallow(
      <ObservationPage
        doneBy={new MusitActor({ dataportenId: '12345', fn: 'Jarl'})}
        onSaveObservation={() => true}
        doneDate={'2016-12-23T00:00:00.000Z'}
        mode="EDIT"
        id="1"
      />
    );
    expect(shallowToJson(observationPage)).toMatchSnapshot();
  });
});