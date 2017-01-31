import { Observable, Subject } from 'rxjs';
import { I18n } from 'react-i18nify';
import { createStore } from 'react-rxjs/dist/RxStore';
import { Reports } from '../../models/report';


const initialState= { data: [] }

export const clear$ = new Subject();

export const loadKDReport$  = new Subject().switchMap(cmd =>
  Reports(cmd.id).getKDReport(cmd.token).flatMap(rows => rows));


export const reducer$ = (actions) =>
  Observable.empty().merge(
    actions.clear$.map(() => () => initialState),
    actions.loadKDReport$.map((data) => (state) => ({...state, data, error: null}))
  );

export default createStore('Reports', reducer$({clear$, loadKDReport$}), Observable.of(initialState));