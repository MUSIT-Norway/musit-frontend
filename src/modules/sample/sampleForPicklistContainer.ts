// @flow
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import sampleForm from './sampleAddForm';
import SampleFormComponent from './SampleFormComponent';
import { flowRight } from 'lodash';
import * as PropTypes from 'prop-types';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/first';
import lifeCycle from '../../shared/lifeCycle';
import { sampleProps } from './shared/submit';
import { loadPredefinedTypes } from '../../stores/predefinedLoader';
import { addObject$, clearObjects$ } from '../../stores/pickList';
import { DomEvent } from '../../types/dom';
import sampleStore$, {
  createSamplesForObjects$,
  clearSampleResponses$
} from './sampleStore';
import { flattenSample } from './shared/types';
import Config from '../../config';
import { TODO } from '../../types/common';
import { PicklistData } from '../../types/picklist';

const { form$, updateForm$, loadForm$, clearForm$ } = sampleForm;

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  predefined$: { type: PropTypes.object.isRequired },
  pickList$: { type: PropTypes.object.isRequired },
  form$: form$,
  store$: sampleStore$
};

const props = (props: TODO) => {
  const objectData = (props.pickList as PicklistData).objects
    .filter(o => o.marked)
    .map(o => o.value);
  return {
    ...props,
    ...sampleProps(props),
    objectData: objectData,
    putSamplesInPicklist: () => {
      props.clearObjects();
      props.store.sampleResponses.success.forEach((sr: TODO) =>
        props.addObject({
          value: flattenSample(
            props.appSession,
            props.store.apiSampleTypes,
            sr.objectData,
            sr.sampleData
          ),
          path: []
        })
      );
      props.history.push(
        Config.magasin.urls.client.picklist.goToPicklistObjects(props.appSession)
      );
    },
    clickSave: (e: DomEvent) => {
      e.preventDefault();
      props.createSamplesForObjects({
        objectData,
        form: props.form,
        appSession: props.appSession,
        sampleTypes: props.predefined.sampleTypes
      });
    }
  };
};

const commands = {
  updateForm$,
  loadForm$,
  clearForm$,
  createSamplesForObjects$,
  clearSampleResponses$,
  addObject$,
  clearObjects$
};

const onUnmount = (props: TODO) => {
  props.clearForm();
  props.clearSampleResponses();
};

const CreateMassDestructionSamples = lifeCycle({ onUnmount })(SampleFormComponent);

export default flowRight([inject(data, commands, props), loadPredefinedTypes])(
  CreateMassDestructionSamples
);
