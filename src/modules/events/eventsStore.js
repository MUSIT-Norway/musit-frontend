// @flow
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import Analyses from '../../models/analyses';
import MusitObject from '../../models/object';

const initialState = [];

const concatAnalysesWithMoves = (val) =>
  Observable.forkJoin(
    Analyses.getAnalysesForObject()(val),
    MusitObject.getLocationHistory()(val)
  ).map(([analyses, moves]) =>
    analyses.concat(moves.map(m => ({...m, type: 'Move'})))
  );

export const loadAnalyses$ = createAction('loadAnalyses$').switchMap(concatAnalysesWithMoves);

const reducer$ = loadAnalyses$.map((data) => () => data);

const eventsStore$ = createStore('allEvents', reducer$, Observable.of(initialState));

export default eventsStore$;