// @flow
import EventsComponent from './EventsComponent';
import inject from 'react-rxjs/dist/RxInject';
import events$, { loadAnalyses$, getCurrentLocation$ } from './eventsStore.js';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';
import React from 'react';
import { Observable } from 'rxjs';

const data = {
  appSession$: { type: React.PropTypes.instanceOf(Observable).isRequired },
  events$
};

const commands = { loadAnalyses$, getCurrentLocation$ };

export default flowRight([
  inject(data, commands),
  mount(({ appSession, location: { state }, loadAnalyses, getCurrentLocation }) => {
    const museumId = appSession.getMuseumId();
    const token = appSession.getAccessToken();
    const objectId = state.id;
    const id = state.uuid;
    loadAnalyses({ museumId, token, id, objectId });
    getCurrentLocation({ museumId, token, id, objectId });
  })
])(EventsComponent);