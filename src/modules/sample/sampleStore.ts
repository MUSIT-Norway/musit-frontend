// @flow
import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import { Reducer } from 'react-rxjs';
import { Observable } from 'rxjs';
import Sample from '../../models/sample';
import predefined$ from '../../stores/predefined';
import { KEEP_ALIVE } from '../../stores/constants';
import { Predefined } from '../../types/predefined';
import { SampleData, SampleDataExtended } from '../../types/samples';
import { ObjectData } from '../../types/object';
import { SampleType, SampleTypes, PredefinedSampleTypes } from '../../types/sample';
import { Callback } from '../../types/ajax';
import { getSampleData } from './shared/submit';
import { FormDetails } from './types/form';
import { AppSession } from '../../types/appSession';
import { simpleGet, simplePost } from '../../shared/RxAjax';
import { Maybe, TODO, Star } from '../../types/common';

export type State = {
  apiSampleTypes?: Maybe<Array<SampleType>>;
  sample?: Maybe<SampleDataExtended>;
  data: TODO[];
};

const initialState: State = { data: [] };

export const clearSampleResponses$: Observable<void> = createAction(
  'clearSampleResponses$'
);

export type SampleId = string;

export type SampleResponse = {
  response: Maybe<SampleId>;
  status?: number;
  error: Maybe<Error>;
};

//export type CreateSamplesResponse = { response: Array<SampleResponse>, error: Maybe<Error> };

export const createSamplesForObjects$ /*: Observable<
  Array<CreateSamplesResponse>
>*/ = createAction(
  'createSamplesForObjects$'
).switchMap(
  (props: {
    objectData: Array<ObjectData>;
    form: FormDetails;
    appSession: AppSession;
    sampleTypes: Star;
    callback: Callback<Star>;
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
).switchMap((props: TODO) => Sample.loadSample(simpleGet)(props).do(props.onComplete));

export const clear$: Observable<void> = createAction('clear$');

export const getSamplesForNode$: Observable<Array<SampleData>> = createAction(
  'getSamplesForNode$'
).switchMap(Sample.loadSamplesForNode(simpleGet));

const extendSample = (
  state: State,
  sample: Maybe<SampleDataExtended>,
  apiSampleTypes: Maybe<Array<SampleType>>
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
  getPredefinedTypes$: Observable<Star>;
  clear$: Observable<void>;
  getSampleTypes$: Observable<Star>;
  getSample$: Observable<Star>;
  getSamplesForNode$: Observable<Star>;
  createSamplesForObjects$: Observable<Array<TODO>>;
  clearSampleResponses$: Observable<void>;
};

const reducer$ = (
  actions: Actions,
  predefined: Observable<Predefined>
): Observable<Reducer<State>> =>
  Observable.merge(
    actions.clear$.map(() => (state: TODO) => ({
      ...initialState,
      apiSampleTypes: state.apiSampleTypes
    })),
    actions.clearSampleResponses$.map(() => (state: TODO) => ({
      ...state,
      sampleResponses: null
    })),
    actions.createSamplesForObjects$.map(sampleResponses => (state: TODO) => ({
      ...state,
      sampleResponses: {
        success: sampleResponses.filter(sr => !sr.error),
        failure: sampleResponses.filter(sr => sr.error)
      }
    })),
    actions.getPredefinedTypes$.map(types => (state: TODO) => ({ ...state, ...types })),
    actions.getSampleTypes$.map(sampleTypes => (state: TODO) => ({
      ...state,
      sampleTypes
    })),
    actions.getSample$.map(sample => (state: TODO) =>
      extendSample(state, sample, state.apiSampleTypes)
    ),
    actions.getSamplesForNode$.map(nodeSamples => (state: TODO) => ({
      ...state,
      nodeSamples
    })),
    predefined.map(predefined => (state: TODO) =>
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
