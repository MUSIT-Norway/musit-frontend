import { inject, createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import { flowRight } from 'lodash';
import lifeCycle from '../../../shared/lifeCycle';
import appSession$ from '../../../stores/appSession';
import { loadPredefinedCollectingEventValues } from '../../../stores/loadPredefinedCollectingEventValues';
import predefinedCollectingEventValues$ from '../../../stores/predefinedCollectingEventValues';
import store$, {
  addCollectingEvent$,
  AddCollectingEventProps,
  setDisabledState$,
  setDraftState$,
  addPersonName$,
  AddPersonNameProps,
  addPerson$,
  AddPersonProps,
  getPersonName$,
  GetPersonNameProps
} from './CollectingEventStore';
import { History } from 'history';
import { AjaxPost, AjaxGet } from '../../../types/ajax';
import { CollectingEventComponent } from './CollectingEventComponent';

const combinedStore$ = createStore(
  'combinedStore',
  Observable.combineLatest(
    appSession$,
    predefinedCollectingEventValues$,
    store$,
    (appSession, predefinedCollectingEventValues, store) => () => ({
      appSession,
      predefinedCollectingEventValues,
      store
    })
  )
);

const addCollectingEventProps = (combinedStore: any, upstream: { history: History }) => {
  return {
    ...combinedStore,
    ...upstream,
    store: { ...combinedStore, localState: undefined },
    eventDataReadOnly: false,
    placeReadOnly: false,
    personReadOnly: false,
    addStateHidden: true,
    setDisabledState: (fieldName: string) => (value: boolean) =>
      setDisabledState$.next({ fieldName, value }),
    setDraftState: (subState?: string) => (fieldName: string) => (value: boolean) =>
      setDraftState$.next({ subState: subState, fieldName: fieldName, value: value }),
    addCollectingEvent: (ajaxPost: AjaxPost<any>) => (props: AddCollectingEventProps) =>
      addCollectingEvent$.next({
        data: props.data,
        token: props.token,
        collectionId: props.collectionId,
        ajaxPost,
        callback: props.callback
      }),
    addPersonName: (ajaxPost: AjaxPost<any>) => (props: AddPersonNameProps) =>
      addPersonName$.next({
        data: props.data,
        token: props.token,
        collectionId: props.collectionId,
        ajaxPost,
        callback: props.callback
      }),
    getPersonName: (ajaxGet: AjaxGet<any>) => (props: GetPersonNameProps) =>
      getPersonName$.next({
        id: props.id,
        token: props.token,
        collectionId: props.collectionId,
        ajaxGet,
        callback: props.callback
      }),
    addPerson: (ajaxPost: AjaxPost<any>) => (props: AddPersonProps) =>
      addPerson$.next({
        data: props.data,
        token: props.token,
        collectionId: props.collectionId,
        ajaxPost,
        callback: props.callback
      })
  };
};

export const onMountProps = () => (props: any) => {
  console.log('onMountProps ------>', props);
};

export const onUnmount = () => (props: any) => {};

const ManageCollectingEventsComponent = lifeCycle({
  onMount: onMountProps(),
  onUnmount
})(CollectingEventComponent);

export default flowRight([
  inject(combinedStore$, addCollectingEventProps),
  loadPredefinedCollectingEventValues
])(ManageCollectingEventsComponent);
