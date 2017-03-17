import {Observable} from 'rxjs';
import {createStore, createAction} from 'react-rxjs/dist/RxStore';
import MusitAnalysis from '../../models/analysis';


const objectsData =
  [{ museumNumber: '123',
    subNumber: '12345678911',
    term: '',
    uuid: '1cbf15cb-8348-4e66-99a4-bc314da57a42'
  },
    { museumNumber: '124',
      subNumber: '12345678911',
      term: '',
      uuid: '2cbf15cb-8348-4e66-99a4-bc314da57a42'
    },
    { museumNumber: '125',
      subNumber: '12345678911',
      term: '',
      uuid: '3cbf15cb-8348-4e66-99a4-bc314da57a42'
    }
  ];


export const clearAnalysisTypes$ = createAction('clearAnalysisTypes$');
export const loadAnalysisTypes$ = createAction('loadAnalysisTypes$').switchMap(MusitAnalysis.getAllAnalysisTypes());

export const reducer$ = (actions) => Observable.merge(
  actions.clearAnalysisTypes$.map(() => (state) => ({...state, data: [], loading: true})),
  actions.loadAnalysisTypes$.map((data) => (state) => ({...state, data: {analysisTypes: data }, loading: false})),
);

export const store$ = (actions$ = {clearAnalysisTypes$, loadAnalysisTypes$}) =>
  createStore('analysisStore', reducer$(actions$), Observable.of({objectsData, data: []}));

export default store$();