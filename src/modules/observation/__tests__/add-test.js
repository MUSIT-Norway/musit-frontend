import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import sinon from 'sinon';
import ObservationPage from '../ObservationPage';
import MusitActor from '../../../models/actor';

describe('Render observation page in add mode', () => {
  it('should set default date and have correct date format', () => {
    const onSaveObservation = sinon.spy();
    const observationPage = shallow(
      <ObservationPage
        doneBy={new MusitActor({ dataportenId: '12345', fn: 'Jarl'})}
        doneDate="2017-02-08T11:14:25.889Z"
        onSaveObservation={onSaveObservation}
        mode="ADD"
        id="1"
      />
    );
    expect(shallowToJson(observationPage)).toMatchSnapshot();
  });
});
