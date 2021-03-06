// @flow
import ViewObjectComponent from './ViewObjectComponent';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import { emitWarning } from '../../shared/errors';
import objectStore$, {
  loadObject$,
  loadMoveAndAnalysisEvents$,
  loadSampleEvents$,
  clearStore$,
  ObjectStoreState
} from './objectStore';
import store$, { getAnalysisTypes$ } from '../analysis/analysisStore';
import sampleStore$, { getSampleTypes$ } from '../sample/sampleStore';
import predefinedConservation$, {
  loadConservationTypes$
} from '../../stores/predefinedConservation';
import * as PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import { flowRight } from 'lodash';
import lifeCycle from '../../shared/lifeCycle';
import { toggleObject$ } from '../../stores/pickList';
import { isItemAdded } from '../../stores/pickList';
import MusitObject from '../../models/object';
import sample from '../../models/sample';
import { simpleGet } from '../../shared/RxAjax';
import { I18n } from 'react-i18nify';
import { Star, TODO } from '../../types/common';
import { SampleTypes } from '../../types/predefined';
import { History } from 'history';

const data: {} = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  objectStore$,
  analysisTypes: store$,
  sampleTypes: sampleStore$,
  predefinedConservation: predefinedConservation$,
  pickList$: { type: PropTypes.object.isRequired }
};

type LocalProps = {
  sampleTypes: SampleTypes; //TODO: Is this correct?
  objectStore: ObjectStoreState;
  history: History;
};

const props: {} = (props: LocalProps) => ({
  ...props,
  loading:
    !(props.sampleTypes.sampleTypes && props.sampleTypes.sampleTypes.find) ||
    props.objectStore.loadingObjectData ||
    props.objectStore.loadingSamples ||
    props.objectStore.loadingEvents,
  pickObject: MusitObject.pickObject(toggleObject$, simpleGet),
  isItemAdded,
  goTo: props.history.push,
  sampleStatus: sample.sampleStatuses
});

const commands: {} = {
  loadObject$,
  loadMoveAndAnalysisEvents$,
  loadSampleEvents$,
  getAnalysisTypes$,
  getSampleTypes$,
  clearStore$,
  loadConservationTypes$
};

export const onMount = ({
  loadObject,
  loadMoveAndAnalysisEvents,
  loadSampleEvents,
  match,
  appSession,
  getAnalysisTypes,
  getSampleTypes,
  loadConservationTypes
}: Star) => {
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
  loadMoveAndAnalysisEvents({
    ...ajaxProps,
    callback: {
      onFailure: (e: TODO) => {
        if (e.status === 403 && e.request.url.match('/.*analyses.*/')) {
          emitWarning({
            message: I18n.t('musit.errorMainMessages.objects.notAllowedToSeeAnalysis')
          });
        }
        if (e.status === 403 && e.request.url.match('/.*conservation.*/')) {
          emitWarning({
            message: I18n.t(
              'musit.errorMainMessages.objects.notAllowedToSeeConservations'
            )
          });
        }
        if (e.status === 403 && e.request.url.match('/.*storage.*/')) {
          emitWarning({
            message: I18n.t('musit.errorMainMessages.objects.notAllowedToSeeStorageData')
          });
        }
      }
    }
  });
  getAnalysisTypes(ajaxProps);
  getSampleTypes(ajaxProps);
  loadConservationTypes(ajaxProps);
};

const onUnmount = (props: TODO) => {
  props.clearStore();
};

export default flowRight([
  inject(data, commands, props),
  lifeCycle({ onMount, onUnmount })
])(ViewObjectComponent);
