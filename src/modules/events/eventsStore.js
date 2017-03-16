// @flow
import { createStore } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';

type Event = {
  id: number,
  type: string,
  registeredDate: string,
  registeredBy: string
};

const initialState: Event[] = [
  {
    id: 1,
    type: 'Sample',
    registeredDate: '2017-03-16T13:30:36+00:00',
    registeredBy: 'Karl parl'
  },
  {
    id: 2,
    type: 'Analyses',
    registeredDate: '2017-03-16T13:30:36+00:00',
    registeredBy: 'Karl parl'
  },
  {
    id: 2,
    type: 'Sample',
    registeredDate: '2017-03-16T13:30:36+00:00',
    registeredBy: 'Karl parl'
  }
];

const reducer$ = Observable.empty();

const eventsStore$ = createStore('allEvents', reducer$, Observable.of(initialState));

export default eventsStore$;