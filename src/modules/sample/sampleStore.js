// @flow
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable, Subject } from 'rxjs';
import Sample from '../../models/sample';
import predefined$ from '../../stores/predefined';
import { KEEP_ALIVE } from '../../stores/constants';
import type { Predefined } from 'types/predefined';
import type { SampleData } from '../../types/samples';
import type { ObjectData } from '../../types/object';
import type { SampleType, SampleTypes, PredefinedSampleTypes } from '../../types/sample';
import type { Callback } from '../../models/types/ajax';
import { getSampleData } from './shared/submit';
import type { FormDetails } from './types/form';
import type { AppSession } from '../../types/appSession';

export type SampleDataExtended = { sampleType?: SampleType } & SampleData;

const initialState = { data: [] };

export const clearSampleResponses$: Subject<*> = createAction('clearSampleResponses$');

export type SampleId = string;

export type SampleResponse = { response: ?SampleId, status?: number, error: ?Error };

export type CreateSamplesResponse = { response: Array<SampleResponse>, error: ?Error };

export const createSamplesForObjects$: Subject<
  Array<CreateSamplesResponse>
> = createAction(
  'createSamplesForObjects$'
).switchMap(
  (props: {
    objectData: Array<ObjectData>,
    form: FormDetails,
    appSession: AppSession,
    sampleTypes: any,
    callback: Callback
  }) => {
    const tasks$ = props.objectData.map(od => {
      return Sample.addSample()({
        museumId: props.appSession.museumId,
        token: props.appSession.accessToken,
        data: getSampleData(props.form, null, od, props.sampleTypes, props.appSession)
      })
        .catch((error: Error) => Observable.of({ response: null, error }))
        .flatMap((res: SampleResponse) => {
          const sampleId = res.response;
          if (res.status === 201 && sampleId) {
            return Sample.loadSample()({
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

export const getPredefinedTypes$: Subject<PredefinedSampleTypes> = createAction(
  'getPredefinedTypes$'
).switchMap(Sample.loadPredefinedTypes());

export const getSampleTypes$: Subject<SampleTypes> = createAction(
  'getSampleTypes$'
).switchMap(Sample.loadAllSampleTypes());

export const getSample$: Subject<SampleDataExtended> = createAction(
  'getSample$'
).switchMap(props => Sample.loadSample()(props).do(props.onComplete));

export const clear$: Subject<*> = createAction('clear$');

export const getSamplesForNode$: Subject<Array<SampleData>> = createAction(
  'getSamplesForNode$'
).switchMap(Sample.loadSamplesForNode());

const extendSample = (state, sample: SampleDataExtended, apiSampleTypes) => {
  if (sample && apiSampleTypes) {
    const sampleType = apiSampleTypes.find(st => st.sampleTypeId === sample.sampleTypeId);
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
  } else {
    return { ...state, sample, apiSampleTypes };
  }
};

export type Actions = {
  getPredefinedTypes$: Subject<*>,
  clear$: Subject<*>,
  getSampleTypes$: Subject<*>,
  getSample$: Subject<*>,
  getSamplesForNode$: Subject<*>,
  createSamplesForObjects$: Subject<Array<CreateSamplesResponse>>,
  clearSampleResponses$: Subject<void>
};

const reducer$ = (actions: Actions, predefined: Subject<Predefined>) =>
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
      extendSample(state, sample, state.apiSampleTypes)),
    actions.getSamplesForNode$.map(nodeSamples => state => ({
      ...state,
      nodeSamples
    })),
    predefined.map(predefined => state =>
      extendSample(
        state,
        state.sample,
        predefined.sampleTypes ? predefined.sampleTypes.raw : null
      ))
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
  predefined: Subject<Predefined> = predefined$
) =>
  createStore(
    'sampleStore$',
    reducer$(actions, predefined),
    Observable.of(initialState),
    KEEP_ALIVE
  );

export default sampleStore$();
