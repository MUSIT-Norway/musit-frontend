// @flow
import { Observable } from 'rxjs';
import inject from 'react-rxjs/dist/RxInject';
import ConservationViewComponent from './conservationViewComponent';
import type { Props as ConservationProps } from './conservationViewComponent';
import predefined$ from '../../stores/predefined';
import { loadCustomPredefinedTypes } from '../../stores/predefinedLoader';
import appSession$ from '../../stores/appSession';
import lifeCycle from '../../shared/lifeCycle';
import store$, { getConservation$, clearStore$ } from './conservationStore';
import Conservation from '../../models/conservation';
import conservationForm, { fieldsArray } from './conservationForm';
import Config from '../../config';
import { onUnMount } from './shared/conservationFormProps';
import type { Field } from '../../forms/form';
import type { History } from '../../types/Routes';
import { I18n } from 'react-i18nify';

const { form$, loadForm$, clearForm$ } = conservationForm;

function storeFactory() {
  return Observable.combineLatest(
    appSession$,
    predefined$,
    store$,
    form$,
    (appSession, predefined, store, form) => ({
      appSession,
      predefined,
      store,
      form
    })
  );
}

type UpstreamProps = {
  match: { params: { conservationId: number } },
  history: History
};

export function props(props: *, upstream: UpstreamProps): ConservationProps {
  return {
    ...props,
    ...upstream,
    loadingConservation: !props.store.conservation,
    getConservation: getConservation$.next.bind(getConservation$),
    loadForm: loadForm$.next.bind(loadForm$),
    clearForm: clearForm$.next.bind(clearForm$),
    clearStore: clearStore$.next.bind(clearStore$),
    objects: props.form.objects || [],
    clickEdit: () => {
      upstream.history.push(
        Config.magasin.urls.client.conservation.editConservation(
          props.appSession,
          upstream.match.params.conservationId
        )
      );
    }
  };
}

export const onMount = (props: ConservationProps) => {
  props.getConservation({
    id: props.match.params.conservationId,
    sampleTypes: props.predefined.sampleTypes,
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
  onUnMount
})(ConservationViewComponent);

export default loadCustomPredefinedTypes(
  predefined$,
  appSession$,
  inject(storeFactory, props)(MountableConservationViewComponent)
);
