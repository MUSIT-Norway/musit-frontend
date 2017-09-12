// @flow
import inject from 'react-rxjs/dist/RxInject';
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
import flowRight from 'lodash/flowRight';
import props, { onUnmount } from './shared/formProps';
import lifeCycle from '../../shared/lifeCycle';
import predefined$ from '../../stores/predefined';
import appSession$ from '../../stores/appSession';
import type { Location } from './shared/submit';
import type { History } from '../../types/Routes';

const { form$, updateForm$, clearForm$ } = analysisForm;

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

function addProps(
  storeProps: *,
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

export default flowRight([inject(storeFactory, addProps), loadPredefinedTypes])(
  ManagedAnalysisFormComponent
);
