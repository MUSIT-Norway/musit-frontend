// @flow
import ConservationEditComponent from './conservationComponent';
import inject from 'react-rxjs/dist/RxInject';
import { Observable } from 'rxjs';
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
import type { Field } from '../../forms/form';
import type { ChangePage } from '../../search/searchStore';

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
  console.log('StoreProps', storeProps);
  const sharedProps = props({
    ...storeProps,
    ...upstream,
    updateForm: updateForm$.next.bind(updateForm$)
  });
  console.log('SharedProps', sharedProps);
  return {
    ...sharedProps,
    loadingConservation: !storeProps.store.conservation,
    getConservation: getConservation$.next.bind(getConservation$),
    loadForm: loadForm$.next.bind(loadForm$),
    clearStore: clearStore$.next.bind(clearStore$),
    clearForm: clearForm$.next.bind(clearForm$)
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
