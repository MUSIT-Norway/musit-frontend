// @flow
import ConservationAddComponent from './conservationComponent';
import { inject } from 'react-rxjs';
import { createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import { flowRight } from 'lodash';
import conservationForm from './conservationForm';
import props, { onUnmount } from './shared/formProps';
import lifeCycle from '../../shared/lifeCycle';
import appSession$ from '../../stores/appSession';
import store$, { clearStore$ } from './conservationStore';
import { loadPredefinedConservationTypes } from '../../stores/predefinedConservationLoader';
import predefinedConservation$ from '../../stores/predefinedConservation';
import { Props } from './conservationComponent';
import { Location } from './shared/submit';
import { History } from 'history';
import { ObjectData } from '../../types/object';
import { formatISOString } from '../../shared/util';
import { Star, TODO } from '../../types/common';

const { form$, updateForm$, clearForm$ } = conservationForm;

function addProps(
  storeProps: Star,
  upstream: { history: History; location: Location<Array<ObjectData>> }
): Props {
  const sharedProps = props({
    ...storeProps,
    ...upstream,
    updateForm: updateForm$.next.bind(updateForm$)
  }) as TODO;
  return {
    ...sharedProps,
    clearStore: clearStore$.next.bind(clearStore$),
    clearForm: clearForm$.next.bind(clearForm$),
    loadingConservation: false,
    addMode: true
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

export const onMountProps = () => (props: any) => {
  const defaultActorsAndRoles = [
    {
      name: props.appSession && props.appSession.actor && props.appSession.actor.fn,
      uuid:
        props.appSession && props.appSession.actor && props.appSession.actor.dataportenId,
      role: 1,
      date: formatISOString(new Date())
    }
  ];

  if (!(props.form.actorsAndRoles.value && props.form.actorsAndRoles.value.length > 0)) {
    props.updateForm({
      name: 'actorsAndRoles',
      rawValue: defaultActorsAndRoles
    });
  }
};

const ManagedConservationFormComponent = lifeCycle({
  onMount: onMountProps(),
  onUnmount
})(ConservationAddComponent);

export default flowRight([
  inject(combinedStore$, addProps),
  loadPredefinedConservationTypes
])(ManagedConservationFormComponent);
