// @flow
import { inject } from 'react-rxjs';
import { createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import analysisForm from './analysisForm';
import AnalysisFormComponent from './AnalysisFormComponent';
import { Props } from './AnalysisFormComponent';
import { loadPredefinedTypes } from '../../stores/predefinedLoader';
import store$, {
  updateExtraDescriptionAttribute$,
  updateExtraResultAttribute$,
  clearStore$
} from './analysisStore';
import { AnalysisStoreState } from './analysisStore';
import { flowRight } from 'lodash';
import props, { onUnmount } from './shared/formProps';
import lifeCycle from '../../shared/lifeCycle';
import { FormData } from './shared/formType';
import predefined$ from '../../stores/predefined';
import appSession$ from '../../stores/appSession';
import { Location } from './shared/submit';
import { History } from 'history';
import { AppSession } from '../../types/appSession';
import { Predefined } from '../../types/predefined';
import { Star, MUSTFIX } from '../../types/common';

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
    appSession: AppSession;
    predefined: Predefined;
    store: AnalysisStoreState;
    form: FormData;
  },
  upstream: { history: History; location: Location<Star> }
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
  } as MUSTFIX);
  return {
    ...sharedProps,
    clearStore: clearStore$.next.bind(clearStore$),
    clearForm: clearForm$.next.bind(clearForm$),
    loadingAnalysis: false
  } as MUSTFIX;
}

const ManagedAnalysisFormComponent = lifeCycle({ onUnmount })(
  AnalysisFormComponent as MUSTFIX
);

export default flowRight([inject(combinedStore$, addProps), loadPredefinedTypes])(
  ManagedAnalysisFormComponent
);
