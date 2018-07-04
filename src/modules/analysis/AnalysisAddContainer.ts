// @flow
import { inject } from 'react-rxjs';
import { createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import analysisForm from './analysisForm';
import AnalysisFormComponent from './AnalysisFormComponent';
import type { Props } from './AnalysisFormComponent';
import { loadPredefinedTypes } from '../../stores/predefinedLoader';
import store$, {
  updateExtraDescriptionAttribute$,
  updateExtraResultAttribute$,
  clearStore$
} from './analysisStore';
import type { AnalysisStoreState } from './analysisStore';
import flowRight from 'lodash/flowRight';
import props, { onUnmount } from './shared/formProps';
import lifeCycle from '../../shared/lifeCycle';
import type { FormData } from './shared/formType';
import predefined$ from '../../stores/predefined';
import appSession$ from '../../stores/appSession';
import type { Location } from './shared/submit';
import type { History } from '../../types/Routes';
import type { AppSession } from '../../types/appSession';
import type { Predefined } from '../../types/predefined';

const { form$, updateForm$, clearForm$ } = analysisForm;

const combinedStore$ = createStore(
  'combinedStore',
  Observable.combineLatest(
    appSession$,
    predefined$,
    store$,
    form$,
    (appSession, predefined, store, form) => () => ({
      appSession,
      predefined,
      store,
      form
    })
  )
);

function addProps(
  storeProps: {
    appSession: AppSession,
    predefined: Predefined,
    store: AnalysisStoreState,
    form: FormData
  },
  upstream: { history: History, location: Location<*> }
): Props {
  const sharedProps = props({
    ...storeProps,
    ...upstream,
    updateExtraDescriptionAttribute: updateExtraDescriptionAttribute$.next.bind(
      updateExtraDescriptionAttribute$
    ),
    updateExtraResultAttribute: updateExtraResultAttribute$.next.bind(
      updateExtraResultAttribute$
    ),
    updateForm: updateForm$.next.bind(updateForm$)
  });
  return {
    ...sharedProps,
    clearStore: clearStore$.next.bind(clearStore$),
    clearForm: clearForm$.next.bind(clearForm$),
    loadingAnalysis: false
  };
}

const ManagedAnalysisFormComponent = lifeCycle({ onUnmount })(AnalysisFormComponent);

export default flowRight([inject(combinedStore$, addProps), loadPredefinedTypes])(
  ManagedAnalysisFormComponent
);
