import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import { EventsComponent } from '../EventsComponent';
import { AppSession } from '../../app/appSession';
describe('EventsComponent', () => {
  it('Check it renders.', () => {
    const myDiv = shallow(
      <EventsComponent
        store={{
          data: []
        }}
        route={{
          showObservations: true,
          showControls: true
        }}
        params={{
          id: '1'
        }}
        appSession={new AppSession({})}
        clearEvents={() => true}
        loadEvents={() => true}
        loadRootNode={() => true}
      />
    );
    expect(shallowToJson(myDiv)).toMatchSnapshot();
  });
});
