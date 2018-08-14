import { inject, createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import PersonComponent from './PersonComponent';
import { flowRight } from 'lodash';
import lifeCycle from '../../../shared/lifeCycle';
import appSession$ from '../../../stores/appSession';
import store$, {
  addPerson$,
  editPerson$,
  getPerson$,
  EditPersonProps,
  AddPersonProps,
  GetPersonProps
} from './PersonStore';
import { History } from 'history';
import { simpleGet, simplePut } from '../../../shared/RxAjax';
import { AjaxPost } from '../../../types/ajax';

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
  addPerson: (ajaxPost: AjaxPost<any>) => (props: AddPersonProps) =>
    addPerson$.next({
      data: props.data,
      token: props.token,
      collectionId: props.collectionId,
      ajaxPost
    }),
  getPerson: (props: GetPersonProps) =>
    getPerson$.next({
      id: props.id,
      token: props.token,
      collectionId: props.collectionId,
      ajaxGet: simpleGet
    }),
  editPerson: (props: EditPersonProps) =>
    editPerson$.next({
      id: props.id,
      data: props.data,
      token: props.token,
      collectionId: props.collectionId,
      ajaxPut: simplePut
    })
});

export const onMountProps = () => (props: any) => {};

export const onUnmount = () => (props: any) => {};

const ManagedConservationFormComponent = lifeCycle({
  onMount: onMountProps(),
  onUnmount
})(PersonComponent);

export default flowRight([inject(combinedStore$, addProps)])(
  ManagedConservationFormComponent
);
