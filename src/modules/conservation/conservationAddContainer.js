// @flow
import ConservationAddComponent from './conservationComponent';
import inject from 'react-rxjs/dist/RxInject';
import createStore from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import flowRight from 'lodash/flowRight';
import conservationForm from './conservationForm';
import props, { onUnmount } from './shared/formProps';
import lifeCycle from '../../shared/lifeCycle';
import appSession$ from '../../stores/appSession';
import store$, { clearStore$ } from './conservationStore';
import { loadPredefinedConservationTypes } from '../../stores/predefinedConservationLoader';
import predefinedConservation$ from '../../stores/predefinedConservation';
import type { Props } from './conservationComponent';
import type { Location } from './shared/submit';
import type { History } from '../../types/Routes';
import type { ObjectData } from '../../types/object';

const { form$, updateForm$, clearForm$ } = conservationForm;

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
    clearStore: clearStore$.next.bind(clearStore$),
    clearForm: clearForm$.next.bind(clearForm$),
    loadingConservation: false
  };
}

const combinedStore$ = createStore(
  'combinedStore',
  Observable.combineLatest(
    appSession$,
    predefinedConservation$,
    store$,
    form$,
    (appSession, predefinedConservation, store, form) => () => ({
      appSession,
      predefinedConservation,
      store,
      form
    })
  )
);

const ManagedConservationFormComponent = lifeCycle({ onUnmount })(
  ConservationAddComponent
);

export default flowRight([
  inject(combinedStore$, addProps),
  loadPredefinedConservationTypes
])(ManagedConservationFormComponent);
