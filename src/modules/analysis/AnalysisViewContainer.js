// @flow
import inject from 'react-rxjs/dist/RxInject';
import PropTypes from 'prop-types';
import AnalysisViewComponent from './AnalysisViewComponent';
import { loadPredefinedTypes } from '../../stores/predefined';
import flowRight from 'lodash/flowRight';
import lifeCycle from '../../shared/lifeCycle';
import store$, { getAnalysis$, setLoading$, clearStore$ } from './analysisStore';
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
  getExtraDescriptionAttributesWithValue,
  getAnalysisObjects
} from './shared/getters';
import { onUnmount } from './shared/formProps';
import type { AppSession } from '../../types/appSession';
import type { Predefined } from '../../types/predefined';
import type { Store } from './shared/storeType';
import type { FormData } from './shared/formType';
import type { Field } from '../../forms/form';
import type { FormValue } from '../../models/analysis/analysisForm';
import type { History } from '../../types/Routes';

const { form$, ...formActions } = analysisForm;

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  predefined$: { type: PropTypes.object.isRequired },
  store$,
  form$
};

const commands = {
  getAnalysis$,
  setLoading$,
  clearStore$,
  ...formActions
};

type UpstreamProps = {
  store: Store,
  match: { params: { analysisId: string } },
  appSession: AppSession,
  predefined: Predefined,
  form: FormData,
  history: History
};

export const props = (props: UpstreamProps) => {
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

  const extraDescriptionAttributes = analysisType &&
    analysisType.extraDescriptionAttributes
    ? analysisType.extraDescriptionAttributes
    : [];

  return {
    ...props,
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
    objects: getAnalysisObjects(props.form),
    clickEdit: () => {
      props.history.push(
        Config.magasin.urls.client.analysis.editAnalysis(
          props.appSession,
          props.match.params.analysisId
        )
      );
    }
  };
};

type OnMountProps = {
  loadForm: (fields: Array<FormValue>) => void,
  setLoading: () => void,
  match: { params: { analysisId?: string } },
  appSession: AppSession,
  predefined: Predefined,
  getAnalysis: (params: {
    id: ?string,
    sampleTypes: any,
    museumId: number,
    collectionId: string,
    token: string
  }) => void
};

export const onMount = (props: OnMountProps) => {
  props.setLoading();
  props.getAnalysis({
    id: props.match.params.analysisId,
    sampleTypes: props.predefined.sampleTypes,
    museumId: props.appSession.museumId,
    collectionId: props.appSession.collectionId,
    token: props.appSession.accessToken
  });
};

type OnPropsProps = {
  loadForm: (fields: Array<FormValue>) => void,
  store: Store,
  form: FormData
};

export const onReceiveProps = (fieldsArray: Array<Field<any>>) => (
  props: OnPropsProps
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

export default flowRight([inject(data, commands, props), loadPredefinedTypes])(
  MountableAnalysisViewComponent
);
