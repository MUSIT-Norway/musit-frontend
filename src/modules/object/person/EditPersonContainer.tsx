import { inject, createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import PersonComponent from './PersonComponent';
import { flowRight } from 'lodash';
import lifeCycle from '../../../shared/lifeCycle';
import appSession$ from '../../../stores/appSession';
import store$, {
  getPerson$,
  MergePersonProps,
  mergePerson$,
  editPerson$,
  EditPersonProps
} from './PersonStore';
import { AppSession } from '../../../types/appSession';
import { History } from 'history';
import { simpleGet } from '../../../shared/RxAjax';
import { AjaxPut, AjaxPost } from '../../../types/ajax';

const combinedStore$ = createStore(
  'combinedStore',
  Observable.combineLatest(appSession$, store$, (appSession, store) => () => ({
    appSession,
    store
  }))
);

const editProps = (combinedStore: any, upstream: { history: History }) => ({
  ...combinedStore,
  ...upstream,
  getPerson: (appSession: AppSession, id: string) =>
    getPerson$.next({
      id: id,
      collectionId: appSession.collectionId,
      token: appSession.accessToken,
      ajaxGet: simpleGet
    }),
  mergePerson: (ajaxPost: AjaxPost<any>) => (props: MergePersonProps) => {
    mergePerson$.next({
      id: props.id,
      data: props.data,
      token: props.token,
      collectionId: props.collectionId,
      ajaxPost,
      callback: props.callback
    });
  },
  editPerson: (ajaxPut: AjaxPut<any>) => (props: EditPersonProps) => {
    editPerson$.next({
      id: props.id,
      data: props.data,
      token: props.token,
      collectionId: props.collectionId,
      ajaxPut,
      callback: props.callback
    });
  },
  readOnly: false
});

export const onMountProps = () => (props: any) => {
  console.log('Props', props);
  props.getPerson(props.appSession, props.match.params.id);
};

export const onUnmount = () => (props: any) => {};

const ManagedConservationFormComponent = lifeCycle({
  onMount: onMountProps(),
  onUnmount
})(PersonComponent);

export default flowRight([inject(combinedStore$, editProps)])(
  ManagedConservationFormComponent
);
