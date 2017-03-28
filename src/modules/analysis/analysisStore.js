import {Observable} from 'rxjs';
import {createStore, createAction} from 'react-rxjs/dist/RxStore';
import MusitAnalysis from '../../models/analysis';

export const objectsData = [
  {
    museumNumber: '123',
    subNumber: '12345678911',
    term: 'Spyd',
    uuid: '1cbf15cb-8348-4e66-99a4-bc314da57a42'
  },
  {
    museumNumber: '124',
    subNumber: '12345678912',
    term: 'Beltering',
    uuid: '2cbf15cb-8348-4e66-99a4-bc314da57a42'
  },
  {
    museumNumber: '125',
    subNumber: '12345678913',
    term: 'Øsekar',
    uuid: '3cbf15cb-8348-4e66-99a4-bc314da57a42'
  }
];

export const loadAnalysisTypes$ = createAction('loadAnalysisTypes$').switchMap(MusitAnalysis.getAllAnalysisTypes());

export const reducer$ = (actions) => Observable.merge(
  actions.loadAnalysisTypes$.map((analysisTypes) => (state) => ({...state, data: { analysisTypes }})),
);

export const store$ = (actions$ = {loadAnalysisTypes$}) =>
  createStore('analysisStore', reducer$(actions$), Observable.of({ objectsData, data: { analysisTypes: [] } }));

export default store$();