// @flow
import { Observable } from 'rxjs';
import inject from 'react-rxjs/dist/RxInject';
import AnalysisViewComponent from './AnalysisViewComponent';
import type { Props as AnanlysisProps } from './AnalysisViewComponent';
import predefined$ from '../../stores/predefined';
import { loadCustomPredefinedTypes } from '../../stores/predefinedLoader';
import appSession$ from '../../stores/appSession';
import lifeCycle from '../../shared/lifeCycle';
import store$, {
  getAnalysis$,
  clearStore$,
  updateAnalysis$,
  updateRestriction$,
  toggleCancelDialog$
} from './analysisStore';
import Analysis from '../../models/analysis';
import analysisForm, { fieldsArray } from './analysisForm';
import Config from '../../config';
import {
  getExtraResultAttributes,
  getAnalysisType,
  getAnalysisPurpose,
  getAnalysisTypeTerm,
  getLabPlaceText,
  getStatusText,
  getExtraDescriptionAttributesWithValue
} from './shared/getters';
import { onUnmount } from './shared/formProps';
import type { Field } from '../../forms/form';
import type { History } from '../../types/Routes';
import { emitError, emitSuccess } from '../../shared/errors';
import { I18n } from 'react-i18nify';
import { isRestrictionValidForCancellation } from './shared/formProps';

const { form$, loadForm$, clearForm$ } = analysisForm;

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
  match: { params: { analysisId: string } },
  history: History
};

export function props(props: *, upstream: UpstreamProps): AnanlysisProps {
  const analysisType = getAnalysisType(
    parseInt(props.store.analysis ? props.store.analysis.analysisTypeId : null, 10),
    props.predefined.analysisTypes
  );

  const extraResultAttributes = getExtraResultAttributes(
    analysisType,
    props.store.analysis,
    props.store.extraResultAttributes,
    props.appSession.language
  );

  const extraDescriptionAttributes =
    analysisType && analysisType.extraDescriptionAttributes
      ? analysisType.extraDescriptionAttributes
      : [];

  const hasRestrictions = !!(
    props.form.restrictions &&
    props.store.analysis &&
    props.store.analysis.restriction &&
    !props.store.analysis.restriction.cancelledStamp
  );

  return {
    ...props,
    ...upstream,
    loadingAnalysis: !props.store.analysis,
    getAnalysis: getAnalysis$.next.bind(getAnalysis$),
    loadForm: loadForm$.next.bind(loadForm$),
    clearForm: clearForm$.next.bind(clearForm$),
    clearStore: clearStore$.next.bind(clearStore$),
    toggleCancelDialog: toggleCancelDialog$.next.bind(toggleCancelDialog$),
    updateAnalysis: updateAnalysis$.next.bind(updateAnalysis$),
    updateRestriction: updateRestriction$.next.bind(updateRestriction$),
    isRestrictionValidForCancellation: isRestrictionValidForCancellation(
      props.store.analysis && props.store.analysis.restriction
    ),
    hasRestrictions,
    extraResultAttributes,
    extraDescriptionAttributes: getExtraDescriptionAttributesWithValue(
      props.store.analysis,
      extraDescriptionAttributes,
      props.appSession.language
    ),
    analysisPurpose: getAnalysisPurpose(
      props.form.reason.value,
      props.predefined.purposes,
      props.appSession.language
    ),
    analysisTypeTerm: getAnalysisTypeTerm(
      props.form.analysisTypeId.value,
      props.predefined.analysisTypes,
      props.appSession.language
    ),
    statusText: getStatusText(props.form.status.value),
    labPlaceText: getLabPlaceText(
      props.predefined.analysisLabList,
      props.form.orgId.value
    ),
    objects: props.form.events.value || [],
    clickEdit: () => {
      upstream.history.push(
        Config.magasin.urls.client.analysis.editAnalysis(
          props.appSession,
          upstream.match.params.analysisId
        )
      );
    },
    cancelRestriction: () => {
      updateAnalysis$.next({
        id: props.store.analysis ? props.store.analysis.id : null,
        museumId: props.appSession.museumId,
        data: {
          ...props.store.analysis,
          objects:
            props.store.analysis && props.store.analysis.events
              ? props.store.analysis.events.map(e => ({
                  objectId: e.affectedThing,
                  objectType: e.affectedType
                }))
              : []
        },
        token: props.appSession.accessToken,
        callback: {
          onComplete: () => {
            emitSuccess({
              type: 'saveSuccess',
              message: I18n.t('musit.analysis.saveAnalysisSuccess')
            });
          },
          onFailure: e => {
            emitError({
              type: 'errorOnSave',
              error: e,
              message: I18n.t('musit.analysis.saveAnalysisError')
            });
          }
        }
      });
    }
  };
}

export const onMount = (props: AnanlysisProps) => {
  props.getAnalysis({
    id: props.match.params.analysisId,
    sampleTypes: props.predefined.sampleTypes,
    museumId: props.appSession.museumId,
    collectionId: props.appSession.collectionId,
    token: props.appSession.accessToken
  });
};

export const onReceiveProps = (fieldsArray: Array<Field<any>>) => (
  props: AnanlysisProps
) => {
  if (props.store.analysis && !props.form.analysisTypeId.value) {
    props.loadForm(Analysis.fromJsonToForm(props.store.analysis, fieldsArray));
  }
};

const MountableAnalysisViewComponent = lifeCycle({
  onMount,
  onReceiveProps: onReceiveProps(fieldsArray),
  onUnmount
})(AnalysisViewComponent);

export default loadCustomPredefinedTypes(
  predefined$,
  appSession$,
  inject(storeFactory, props)(MountableAnalysisViewComponent)
);
