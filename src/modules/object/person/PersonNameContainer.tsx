import { inject, createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import PersonNameComponent from './PersonName';
import { flowRight } from 'lodash';
import { History } from 'history';
import appSession$ from '../../../stores/appSession';
import store$, { addPersonName$, AddPersonNameProps } from './PersonStore';
import { AjaxPost } from '../../../types/ajax';
import lifeCycle from '../../../shared/lifeCycle';

const combinedStore$ = createStore(
  'combinedStore',
  Observable.combineLatest(appSession$, store$, (appSession, store) => () => ({
    appSession,
    store
  }))
);

const addProps = (combinedStore: any, upstream: { history: History }) => ({
  ...combinedStore,
  ...upstream,
  store: { ...combinedStore, personNameState: undefined },
  addPersonName: (ajaxPost: AjaxPost<any>) => (props: AddPersonNameProps) =>
    addPersonName$.next({
      data: props.data,
      token: props.token,
      collectionId: props.collectionId,
      ajaxPost,
      callback: props.callback
    })
});

export const onMountProps = () => (props: any) => {};

export const onUnmount = () => (props: any) => {};

const ManagedConservationFormComponent = lifeCycle({
  onMount: onMountProps(),
  onUnmount
})(PersonNameComponent);

export default flowRight([inject(combinedStore$, addProps)])(
  ManagedConservationFormComponent
);

//

/* const store$ = createStore(
  'store',
  Observable.combineLatest(appSession$, (appSession: AppSession) => () => ({
    appSession
  }))
);

const props = (store: any, upstream: { history: History }) => ({
  ...upstream,
  ...store
});

export default flowRight([inject(store$, props)])(PersonNameComponent);
 */
