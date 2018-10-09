import { inject, createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import PersonComponent from './PersonComponent';
import { flowRight } from 'lodash';
import lifeCycle from '../../../shared/lifeCycle';
import appSession$ from '../../../stores/appSession';
import store$, {
  mergePerson$,
  getPerson$,
  MergePersonProps,
  GetPersonProps
} from './PersonStore';
import { History } from 'history';
import { AjaxPost, AjaxGet } from '../../../types/ajax';

const combinedStore$ = createStore(
  'combinedStore',
  Observable.combineLatest(appSession$, store$, (appSession, store) => () => ({
    appSession,
    store
  }))
);

const mergeProps = (combinedStore: any, upstream: { history: History }) => ({
  ...combinedStore,
  ...upstream,
  store: { ...combinedStore, localState: undefined },
  mergePerson: (ajaxPost: AjaxPost<any>) => (props: MergePersonProps) =>
    mergePerson$.next({
      id: props.id,
      data: props.data,
      token: props.token,
      collectionId: props.collectionId,
      ajaxPost,
      callback: props.callback
    }),
  getPerson: (ajaxGet: AjaxGet<any>) => (props: GetPersonProps) =>
    getPerson$.next({
      id: props.id,
      token: props.token,
      collectionId: props.collectionId,
      ajaxGet
    })
});

export const onMountProps = () => (props: any) => {};

export const onUnmount = () => (props: any) => {};

const MergePersonComponent = lifeCycle({
  onMount: onMountProps(),
  onUnmount
})(PersonComponent);

export default flowRight([inject(combinedStore$, mergeProps)])(MergePersonComponent);
