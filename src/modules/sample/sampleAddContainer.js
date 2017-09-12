import { RxInjectLegacy as inject } from 'react-rxjs';
import sampleForm from './sampleAddForm';
import SampleFormComponent from './SampleFormComponent';
import flowRight from 'lodash/flowRight';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import lifeCycle from '../../shared/lifeCycle';
import sampleStore$, { getSample$, clear$ } from './sampleStore';
import { sampleProps, saveSample, callback, onComplete } from './shared/submit';
import Sample from '../../models/sample';
import { simplePost } from '../../shared/RxAjax';
import objectStore$, { loadObject$ } from '../objects/objectStore';
import { retrieveSample } from './sampleViewContainer';
import { loadPredefinedTypes } from '../../stores/predefinedLoader';
import type { DomEvent } from '../../types/dom';

const { form$, updateForm$, loadForm$, clearForm$ } = sampleForm;

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  predefined$: { type: PropTypes.object.isRequired },
  form$: form$,
  store$: sampleStore$,
  objectStore$: objectStore$
};

const props = (props, ajaxPost = simplePost) => ({
  ...props,
  ...sampleProps(props),
  objectData: [{ ...props.objectStore.objectData, derivedFrom: props.store.sample }],
  clickSave: (e: DomEvent) => {
    e.preventDefault();
    saveSample(Sample.addSample(ajaxPost))(
      props.form,
      props.store.sample,
      props.predefined.sampleTypes,
      props.objectStore.objectData,
      props.match.params,
      props.appSession,
      props.history,
      callback,
      onComplete(props.history, props.appSession)
    );
  }
});

const commands = {
  getSample$,
  loadObject$,
  updateForm$,
  loadForm$,
  clearForm$,
  clearSampleStore$: clear$
};

const onUnmount = props => {
  props.clearForm();
  props.clearSampleStore();
};

const ManagedSampleFormComponent = lifeCycle({ onMount, onUnmount })(SampleFormComponent);

export default flowRight([inject(data, commands, props), loadPredefinedTypes])(
  ManagedSampleFormComponent
);

export function onMount(props) {
  const token = props.appSession.accessToken;
  const museumId = props.appSession.museumId;
  const collectionId = props.appSession.collectionId;
  if (props.match.params.objectId) {
    props.loadObject({
      token,
      objectId: props.match.params.objectId,
      museumId,
      collectionId
    });
  } else if (props.match.params.sampleId) {
    retrieveSample(
      props.match.params.sampleId,
      token,
      museumId,
      collectionId,
      props.getSample,
      props.loadObject
    );
  }
}
