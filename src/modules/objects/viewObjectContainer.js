// @flow
import ViewObjectComponent from './ViewObjectComponent';
import inject from 'react-rxjs/dist/RxInject';
import objectStore$, {
  loadObject$,
  loadMoveAndAnalysisEvents$,
  loadSampleEvents$
} from './objectStore';
import store$, { getAnalysisTypes$ } from '../analysis/analysisStore';
import sampleStore$, { getSampleTypes$ } from '../sample/sampleStore';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import flowRight from 'lodash/flowRight';
import lifeCycle from '../../shared/lifeCycle';
import { toggleObject$ } from '../../stores/pickList';
import { isItemAdded } from '../../stores/pickList';
import MusitObject from '../../models/object';
import sample from '../../models/sample';

const data: {} = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  objectStore$,
  analysisTypes: store$,
  sampleTypes: sampleStore$,
  pickList$: { type: PropTypes.object.isRequired }
};

const props: {} = props => ({
  ...props,
  loading: !(props.sampleTypes.sampleTypes && props.sampleTypes.sampleTypes.find) ||
    props.objectStore.loadingObjectData ||
    props.objectStore.loadingSamples ||
    props.objectStore.loadingEvents,
  pickObject: MusitObject.pickObject(toggleObject$),
  isItemAdded,
  goTo: props.history.push,
  sampleStatus: sample.sampleStatuses
});

const commands: {} = {
  loadObject$,
  loadMoveAndAnalysisEvents$,
  loadSampleEvents$,
  getAnalysisTypes$,
  getSampleTypes$
};

export const onMount = ({
  loadObject,
  loadMoveAndAnalysisEvents,
  loadSampleEvents,
  match,
  appSession,
  getAnalysisTypes,
  getSampleTypes
}: any) => {
  const uuid: string = match.params.id;
  const museumId: number = appSession.museumId;
  const accessToken: string = appSession.accessToken;
  const collectionId: string = appSession.collectionId;
  const ajaxProps = {
    id: uuid,
    objectId: uuid,
    museumId: museumId,
    token: accessToken,
    collectionId: collectionId
  };
  loadObject(ajaxProps);
  loadSampleEvents(ajaxProps);
  loadMoveAndAnalysisEvents(ajaxProps);
  getAnalysisTypes(ajaxProps);
  getSampleTypes(ajaxProps);
};

export default flowRight([inject(data, commands, props), lifeCycle({ onMount })])(
  ViewObjectComponent
);
