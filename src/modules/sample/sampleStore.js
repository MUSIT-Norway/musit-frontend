// @flow

import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable, Subject } from 'rxjs';
import Sample from '../../models/sample';
import predefined$ from '../../stores/predefined';
import { KEEP_ALIVE } from '../../stores/constants';
import type { Predefined } from 'types/predefined';
import type { SampleData } from '../../types/samples';
import type { SampleType, SampleTypes, PredefinedSampleTypes } from '../../types/sample';

export type SampleDataExtended = { sampleType?: SampleType } & SampleData;

const initialState = { data: [] };

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
  getSamplesForNode$: Subject<*>
};

const reducer$ = (actions: Actions, predefined: Subject<Predefined>) =>
  Observable.merge(
    actions.clear$.map(() => state => ({
      ...initialState,
      apiSampleTypes: state.apiSampleTypes
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
    getSamplesForNode$
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
