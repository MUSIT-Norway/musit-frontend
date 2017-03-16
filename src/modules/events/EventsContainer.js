// @flow
import EventsComponent from './EventsComponent';
import inject from 'react-rxjs/dist/RxInject';
import events$ from './eventsStore.js';

const data = { events$ };

export default inject(data)(EventsComponent);