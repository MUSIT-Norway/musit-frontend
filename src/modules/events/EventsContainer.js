// @flow
import EventsComponent from './EventsComponent';
import inject from 'react-rxjs/dist/RxInject';
import eventsStore$, { loadAnalyses$, getCurrentLocation$, setObject$, clear$ } from './eventsStore.js';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';
import React from 'react';
import { Observable } from 'rxjs';

const data = {
  appSession$: { type: React.PropTypes.instanceOf(Observable).isRequired },
  eventsStore$
};

const commands = { loadAnalyses$, getCurrentLocation$, setObject$, clear$ };

export default flowRight([
  inject(data, commands),
  mount(({ appSession, location: { state }, loadAnalyses, getCurrentLocation, setObject, clear }) => {
    const museumId = appSession.getMuseumId();
    const token = appSession.getAccessToken();
    const objectId = state.id;
    const id = state.uuid;
    clear();
    setObject(state);
    loadAnalyses({ museumId, token, id, objectId });
    getCurrentLocation({ museumId, token, id, objectId });
  })
])(EventsComponent);