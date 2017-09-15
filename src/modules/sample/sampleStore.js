// @flow
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import type { Reducer } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import Sample from '../../models/sample';
import predefined$ from '../../stores/predefined';
import { KEEP_ALIVE } from '../../stores/constants';
import type { Predefined } from 'types/predefined';
import type { SampleData, SampleDataExtended } from '../../types/samples';
import type { ObjectData } from '../../types/object';
import type { SampleType, SampleTypes, PredefinedSampleTypes } from '../../types/sample';
import type { Callback } from '../../types/ajax';
import { getSampleData } from './shared/submit';
import type { FormDetails } from './types/form';
import type { AppSession } from '../../types/appSession';
import { simpleGet, simplePost } from '../../shared/RxAjax';

export type State = {
  apiSampleTypes?: ?Array<SampleType>,
  sample?: ?SampleDataExtended
};

const initialState: State = { data: [] };

export const clearSampleResponses$: Observable<void> = createAction(
  'clearSampleResponses$'
);

export type SampleId = string;

export type SampleResponse = { response: ?SampleId, status?: number, error: ?Error };

export type CreateSamplesResponse = { response: Array<SampleResponse>, error: ?Error };

export const createSamplesForObjects$: Observable<
  Array<CreateSamplesResponse>
> = createAction(
  'createSamplesForObjects$'
).switchMap(
  (props: {
    objectData: Array<ObjectData>,
    form: FormDetails,
    appSession: AppSession,
    sampleTypes: *,
    callback: Callback<*>
  }) => {
    const tasks$ = props.objectData.map(od => {
      return Sample.addSample(simplePost)({
        museumId: props.appSession.museumId,
        token: props.appSession.accessToken,
        data: getSampleData(props.form, null, od, props.sampleTypes, props.appSession)
      })
        .catch((error: Error) => Observable.of({ response: null, error }))
        .flatMap((res: SampleResponse) => {
          const sampleId = res.response;
          if (res.status === 201 && sampleId) {
            return Sample.loadSample(simpleGet)({
              id: sampleId,
              museumId: props.appSession.museumId,
              collectionId: props.appSession.collectionId,
              token: props.appSession.accessToken
            }).map(sampleData => ({
              response: sampleId,
              error: null,
              objectData: od,
              sampleData: sampleData
            }));
          } else {
            return Observable.of({ response: null, error: res.error, objectData: od });
          }
        })
        .first();
    });
    // $FlowFixMe | We are passing an array to combineLatest which is not supported by flow-typed definition for rxjs.
    return Observable.combineLatest(...tasks$);
  }
);

export const getPredefinedTypes$: Observable<PredefinedSampleTypes> = createAction(
  'getPredefinedTypes$'
).switchMap(Sample.loadPredefinedTypes(simpleGet));

export const getSampleTypes$: Observable<SampleTypes> = createAction(
  'getSampleTypes$'
).switchMap(Sample.loadAllSampleTypes(simpleGet));

export const getSample$: Observable<SampleDataExtended> = createAction(
  'getSample$'
).switchMap(props => Sample.loadSample(simpleGet)(props).do(props.onComplete));

export const clear$: Observable<void> = createAction('clear$');

export const getSamplesForNode$: Observable<Array<SampleData>> = createAction(
  'getSamplesForNode$'
).switchMap(Sample.loadSamplesForNode(simpleGet));

const extendSample = (
  state: State,
  sample: ?SampleDataExtended,
  apiSampleTypes: ?Array<SampleType>
) => {
  if (!sample || !apiSampleTypes) {
    return { ...state, sample, apiSampleTypes };
  }
  const sampleTypeId = sample.sampleTypeId;
  const sampleType = apiSampleTypes.find(st => st.sampleTypeId === sampleTypeId);
  const extendedSample = { ...sample, sampleType };
  const sampleOrObjectData = extendedSample.parentObject
    ? extendedSample.parentObject.sampleOrObjectData
    : null;
  if (sampleOrObjectData) {
    const parentObjSampleTypeId = sampleOrObjectData.sampleTypeId;
    sampleOrObjectData.sampleType = apiSampleTypes.find(
      st => st.sampleTypeId === parentObjSampleTypeId
    );
  }
  return { ...state, sample: extendedSample, apiSampleTypes };
};

export type Actions = {
  getPredefinedTypes$: Observable<*>,
  clear$: Observable<void>,
  getSampleTypes$: Observable<*>,
  getSample$: Observable<*>,
  getSamplesForNode$: Observable<*>,
  createSamplesForObjects$: Observable<Array<CreateSamplesResponse>>,
  clearSampleResponses$: Observable<void>
};

const reducer$ = (
  actions: Actions,
  predefined: Observable<Predefined>
): Observable<Reducer<State>> =>
  Observable.merge(
    actions.clear$.map(() => state => ({
      ...initialState,
      apiSampleTypes: state.apiSampleTypes
    })),
    actions.clearSampleResponses$.map(() => state => ({
      ...state,
      sampleResponses: null
    })),
    actions.createSamplesForObjects$.map(sampleResponses => state => ({
      ...state,
      sampleResponses: {
        success: sampleResponses.filter(sr => !sr.error),
        failure: sampleResponses.filter(sr => sr.error)
      }
    })),
    actions.getPredefinedTypes$.map(types => state => ({ ...state, ...types })),
    actions.getSampleTypes$.map(sampleTypes => state => ({ ...state, sampleTypes })),
    actions.getSample$.map(sample => state =>
      extendSample(state, sample, state.apiSampleTypes)
    ),
    actions.getSamplesForNode$.map(nodeSamples => state => ({
      ...state,
      nodeSamples
    })),
    predefined.map(predefined => state =>
      extendSample(
        state,
        state.sample,
        predefined.sampleTypes ? predefined.sampleTypes.raw : null
      )
    )
  );

export const sampleStore$ = (
  actions: Actions = {
    getPredefinedTypes$,
    clear$,
    getSampleTypes$,
    getSample$,
    getSamplesForNode$,
    createSamplesForObjects$,
    clearSampleResponses$
  },
  predefined: Observable<Predefined> = predefined$
) => createStore('sampleStore$', reducer$(actions, predefined), initialState, KEEP_ALIVE);

export default sampleStore$();
