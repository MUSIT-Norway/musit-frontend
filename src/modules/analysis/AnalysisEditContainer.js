// @flow
import { inject } from 'react-rxjs';
import { createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import analysisForm, { fieldsArray } from './analysisForm';
import AnalysisFormComponent from './AnalysisFormComponent';
import type { Props } from './AnalysisFormComponent';
import store$, {
  getAnalysis$,
  updateExtraDescriptionAttribute$,
  updateExtraResultAttribute$,
  clearStore$,
  toggleCancelDialog$
} from './analysisStore';
import flowRight from 'lodash/flowRight';
import lifeCycle from '../../shared/lifeCycle';
import { onMount, onReceiveProps } from './AnalysisViewContainer';
import { loadPredefinedTypes } from '../../stores/predefinedLoader';
import props, { onUnmount } from './shared/formProps';
import predefined$ from '../../stores/predefined';
import appSession$ from '../../stores/appSession';
import type { Location } from './shared/submit';
import type { History } from '../../types/Routes';
import type { AppSession } from '../../types/appSession';
import type { Predefined } from '../../types/predefined';
import type { AnalysisStoreState } from './analysisStore';
import type { FormData } from './shared/formType';

const { form$, updateForm$, clearForm$, loadForm$ } = analysisForm;

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

function editProps(
  storeProps: {
    appSession: AppSession,
    predefined: Predefined,
    store: AnalysisStoreState,
    form: FormData
  },
  upstream: { history: History, location: Location<*> }
): Props {
  return {
    ...props({
      ...storeProps,
      ...upstream,
      updateExtraDescriptionAttribute: updateExtraDescriptionAttribute$.next.bind(
        updateExtraDescriptionAttribute$
      ),
      updateExtraResultAttribute: updateExtraResultAttribute$.next.bind(
        updateExtraResultAttribute$
      ),
      updateForm: updateForm$.next.bind(updateForm$)
    }),
    getAnalysis: getAnalysis$.next.bind(getAnalysis$),
    clearStore: clearStore$.next.bind(clearStore$),
    clearForm: clearForm$.next.bind(clearForm$),
    loadForm: loadForm$.next.bind(loadForm$),
    loadingAnalysis: !storeProps.store.analysis,
    toggleCancelDialog: toggleCancelDialog$.next.bind(toggleCancelDialog$)
  };
}

const MountableAnalysisFormComponent = lifeCycle({
  onMount,
  onReceiveProps: onReceiveProps(fieldsArray),
  onUnmount
})(AnalysisFormComponent);

export default flowRight([inject(combinedStore$, editProps), loadPredefinedTypes])(
  MountableAnalysisFormComponent
);
