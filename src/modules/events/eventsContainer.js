import EventsComponent from './EventsComponent';
import inject from 'react-rxjs/dist/RxInject';
import eventsStore$, {
  loadAnalyses$,
  getCurrentLocation$,
  setObject$,
  clear$
} from './eventsStore.js';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  eventsStore$
};

const commands = { loadAnalyses$, getCurrentLocation$, setObject$, clear$ };

export const onMount = ({
  appSession,
  location: { state },
  loadAnalyses,
  getCurrentLocation,
  setObject,
  clear
}) => {
  const museumId = appSession.museumId;
  const token = appSession.accessToken;
  const objectId = state.id;
  clear();
  setObject(state);
  loadAnalyses({ museumId, token, id: state.uuid, objectId }); // TODO Fix this when backend is behaving
  getCurrentLocation({ museumId, token, objectId });
};

export default flowRight([inject(data, commands), mount(onMount)])(EventsComponent);
