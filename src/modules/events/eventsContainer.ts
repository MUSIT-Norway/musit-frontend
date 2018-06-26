import EventsComponent from './EventsComponent';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch/';
import eventsStore$, {
//loadAnalyses$,
  getCurrentLocation$,
  setObject$
  //clearStore$
} from './eventsStore';
import { flowRight } from 'lodash';
import lifeCycle from '../../shared/lifeCycle';
import * as PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import { TODO } from '../../types/common';

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  eventsStore$
};
const commands = { getCurrentLocation$, setObject$ };

//#OLD const commands = { loadAnalyses$, getCurrentLocation$, setObject$, clearStore$ };

export const onMount = ({
  appSession,
  location: { state },
  loadAnalyses,
  getCurrentLocation,
  setObject
}: TODO) => {
  const museumId = appSession.museumId;
  const token = appSession.accessToken;
  const objectId = state.id;
  setObject(state);
  loadAnalyses({ museumId, token, id: state.uuid, objectId }); // TODO Fix this when backend is behaving
  getCurrentLocation({ museumId, token, objectId });
};

const onUnmount = (props: TODO) => {
  props.clearStore();
};

export default flowRight([inject(data, commands), lifeCycle({ onMount, onUnmount })])(
  EventsComponent
);
