// @flow

import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable, Subject } from 'rxjs';
import Sample from '../../models/sample';
import predefined$ from '../../stores/predefined';
import { KEEP_ALIVE } from '../../stores/constants';

import type { SampleData } from 'types/samples';
import type { SampleType } from 'types/sampleTypes';

export type SampleDateExtended = { sampleType?: SampleType } & SampleData;

export type Action = {
  getPredefinedTypes$: Subject,
  clear$: Subject,
  getSampleTypes$: Subject,
  getSample$: Subject,
  getSamplesForNode$: Subject
}

const initialState = { data: [] };

export const getPredefinedTypes$ = createAction('getPredefinedTypes$').switchMap(
  Sample.loadPredefinedTypes()
);

export const getSampleTypes$ = createAction('getSampleTypes$').switchMap(
  Sample.loadAllSampleTypes()
);

export const getSample$ = createAction('getSample$').switchMap(props =>
  Sample.loadSample()(props).do(props.onComplete)
);

export const clear$ = createAction('clear$');

export const getSamplesForNode$ = createAction('getSamplesForNode$').switchMap(
  Sample.loadSamplesForNode()
);

const extendSample = (state, sample, apiSampleTypes) => {
  if (sample && apiSampleTypes) {
    const sampleType = apiSampleTypes.find(st => st.sampleTypeId === sample.sampleTypeId);
    const extendedSample = { ...sample, sampleType };
    return { ...state, sample: extendedSample, apiSampleTypes };
  } else {
    return { ...state, sample, apiSampleTypes };
  }
};

const reducer$ = (actions: Action, predefined: Subject) =>
  Observable.merge(
    actions.clear$.map(() => state => ({
      ...initialState,
      apiSampleTypes: state.apiSampleTypes
    })),
    actions.getPredefinedTypes$.map(types => state => ({ ...state, ...types })),
    actions.getSampleTypes$.map(sampleTypes => state => ({ ...state, sampleTypes })),
    actions.getSample$.map(sample => state =>
      extendSample(state, sample, state.sampleTypes)),
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
  actions: Action = {
    getPredefinedTypes$,
    clear$,
    getSampleTypes$,
    getSample$,
    getSamplesForNode$
  },
  predefined: Subject = predefined$
) =>
  createStore(
    'sampleStore$',
    reducer$(actions, predefined),
    Observable.of(initialState),
    KEEP_ALIVE
  );

export default sampleStore$();
