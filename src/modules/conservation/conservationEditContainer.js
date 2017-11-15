// @flow
import ConservationEditComponent from './conservationComponent';
import inject from 'react-rxjs/dist/RxInject';
import { Observable } from 'rxjs';
import flowRight from 'lodash/flowRight';
import conservationForm, { fieldsArray } from './conservationForm';
import props, { onUnmount } from './shared/formProps';
import lifeCycle from '../../shared/lifeCycle';
import appSession$ from '../../stores/appSession';
import store$, { clearStore$, getConservation$ } from './conservationStore';
import type { Location } from './shared/submit';
import type { History } from '../../types/Routes';
import type { ObjectData } from '../../types/object';
import predefinedConservation$ from '../../stores/predefinedConservation';
import { loadCustomPredefinedConservationTypes } from '../../stores/predefinedConservationLoader';
import Conservation from '../../models/conservation';
import Config from '../../config';
import type { Field } from '../../forms/form';

// FIX ME below 4 lines
//import type { Props } from './conservationComponent';
//import type { Props as ConservationProps } from './conservationComponent';
type Props = any;
type ConservationProps = any;

const { form$, loadForm$, clearForm$, updateForm$ } = conservationForm;

function storeFactory() {
  return Observable.combineLatest(
    appSession$,
    predefinedConservation$,
    store$,
    form$,
    (appSession, predefinedConservation, store, form) => ({
      appSession,
      predefinedConservation,
      store,
      form
    })
  );
}

function addProps(
  storeProps: *,
  upstream: { history: History, location: Location<Array<ObjectData>> }
): Props {
  const sharedProps = props({
    ...storeProps,
    ...upstream,
    updateForm: updateForm$.next.bind(updateForm$)
  });
  return {
    ...sharedProps,
    loadingConservation: !storeProps.store.conservation,
    getConservation: getConservation$.next.bind(getConservation$),
    loadForm: loadForm$.next.bind(loadForm$),
    clearStore: clearStore$.next.bind(clearStore$),
    clearForm: clearForm$.next.bind(clearForm$),
    loadingConservation: false
  };
}

export const onMount = (props: ConservationProps) => {
  props.getConservation({
    id: props.match.params.conservationId,
    sampleTypes: props.predefinedConservation.conservationTypes,
    museumId: props.appSession.museumId,
    collectionId: props.appSession.collectionId,
    token: props.appSession.accessToken
  });
};

export const onReceiveProps = (fieldsArray: Array<Field<any>>) => (
  props: ConservationProps
) => {
  if (props.store.conservation && !props.form.eventTypeId.value) {
    props.loadForm(Conservation.fromJsonToForm(props.store.conservation, fieldsArray));
  }
};

const MountableConservationViewComponent = lifeCycle({
  onMount,
  onReceiveProps: onReceiveProps(fieldsArray),
  onUnmount
})(ConservationEditComponent);

export default loadCustomPredefinedConservationTypes(
  predefinedConservation$,
  appSession$,
  inject(storeFactory, addProps)(MountableConservationViewComponent)
);
