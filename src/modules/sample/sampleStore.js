import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import Sample from '../../models/sample';
import { KEEP_ALIVE } from '../../stores/constants';

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

const reducer$ = actions =>
  Observable.merge(
    actions.clear$.map(() => () => initialState),
    actions.getPredefinedTypes$.map(types => state => ({ ...state, ...types })),
    actions.getSampleTypes$.map(sampleTypes => state => ({ ...state, sampleTypes })),
    actions.getSample$.map(sample => state => ({ ...state, sample })),
    actions.getSamplesForNode$.map(nodeSamples => state => ({
      ...state,
      nodeSamples
    }))
  );

export const sampleStore$ = (
  actions = {
    getPredefinedTypes$,
    clear$,
    getSampleTypes$,
    getSample$,
    getSamplesForNode$
  }
) =>
  createStore('sampleStore$', reducer$(actions), Observable.of(initialState), KEEP_ALIVE);

export default sampleStore$();
