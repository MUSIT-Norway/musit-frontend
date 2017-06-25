import EventsComponent from './EventsComponent';
import inject from 'react-rxjs/dist/RxInject';
import eventsStore$, {
  loadAnalyses$,
  getCurrentLocation$,
  setObject$,
  clearStore$
} from './eventsStore.js';
import flowRight from 'lodash/flowRight';
import lifeCycle from '../../shared/lifeCycle';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  eventsStore$
};

const commands = { loadAnalyses$, getCurrentLocation$, setObject$, clearStore$ };

export const onMount = ({
  appSession,
  location: { state },
  loadAnalyses,
  getCurrentLocation,
  setObject
}) => {
  const museumId = appSession.museumId;
  const token = appSession.accessToken;
  const objectId = state.id;
  setObject(state);
  loadAnalyses({ museumId, token, id: state.uuid, objectId }); // TODO Fix this when backend is behaving
  getCurrentLocation({ museumId, token, objectId });
};

const onUnmount = props => {
  props.clearStore();
};

export default flowRight([inject(data, commands), lifeCycle({ onMount, onUnmount })])(
  EventsComponent
);
