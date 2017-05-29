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
import { emitError, emitSuccess } from '../../shared/errors';
import mount from '../../shared/mount';

const data: {} = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  objectStore$,
  analysisTypes: store$,
  sampleTypes: sampleStore$
};

const props: {} = {
  emitSuccess,
  emitError
};

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
  params,
  appSession,
  getAnalysisTypes,
  getSampleTypes
}: any) => {
  const uuid: string = params.id;
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

export default flowRight([inject(data, commands, props), mount(onMount)])(
  ViewObjectComponent
);
