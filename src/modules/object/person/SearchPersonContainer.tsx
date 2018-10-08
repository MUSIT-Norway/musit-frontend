import { inject, createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import SearchPersonComponent from './SearchPersonComponent';
import { flowRight } from 'lodash';
import appSession$ from '../../../stores/appSession';
import store$, {
  GetPersonsFromPersonNameProps,
  getPersonsFromPersonName$
} from './PersonStore';
import { History } from 'history';
import { AjaxGet } from '../../../types/ajax';

const combinedStore$ = createStore(
  'combinedStore',
  Observable.combineLatest(appSession$, store$, (appSession, store) => () => ({
    appSession,
    store
  }))
);

const searchProps = (combinedStore: any, upstream: { history: History }) => ({
  ...combinedStore,
  ...upstream,
  getPersonsFromPersonName: (ajaxGet: AjaxGet<any>) => (
    searchProps: GetPersonsFromPersonNameProps
  ) => {
    console.log('SP', searchProps);
    getPersonsFromPersonName$.next({
      name: searchProps.name,
      token: searchProps.token,
      collectionId: searchProps.collectionId,
      callback: searchProps.callback,
      ajaxGet: ajaxGet
    });
  }
});

export default flowRight([inject(combinedStore$, searchProps)])(SearchPersonComponent);
