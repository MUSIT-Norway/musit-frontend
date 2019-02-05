import { inject, createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import { flowRight } from 'lodash';
import lifeCycle from '../../../shared/lifeCycle';
import appSession$ from '../../../stores/appSession';
import { AppSession } from '../../../types/appSession';
import { loadPredefinedCollectingEventValues } from '../../../stores/loadPredefinedCollectingEventValues';
import predefinedCollectingEventValues$ from '../../../stores/predefinedCollectingEventValues';
import store$, {
  editEventDateRevision$,
  editEventAttributesRevision$,
  editEventPlaceRevision$,
  editEventMetaData$,
  EditCollectingEventProps,
  EditEventAttributesProps,
  GetPersonNameProps,
  EditPlaceProps,
  getCollectingEvent$,
  setDisabledState$,
  setDraftState$,
  addPerson$,
  addPersonName$,
  getPersonName$,
  EditPersonEventProps,
  AddPersonNameProps,
  AddPersonProps,
  editEventPersonRevision$
} from './CollectingEventStore';
import { History } from 'history';
import { AjaxPost, AjaxGet } from '../../../types/ajax';
import { simpleGet } from '../../../shared/RxAjax';
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

const editCollectingEventProps = (combinedStore: any, upstream: { history: History }) => {
  return {
    ...combinedStore,
    ...upstream,
    eventDataReadOnly:
      localStorage.getItem('editComponent') === 'eventMetaData' ? false : true,
    placeReadOnly: localStorage.getItem('editComponent') === 'place' ? false : true,
    personReadOnly: localStorage.getItem('editComponent') === 'person' ? false : true,
    addStateHidden: true,
    store: { ...combinedStore, localState: combinedStore.store.localState },

    getCollectingEvent: (ajaxGet = simpleGet) => (appSession: AppSession, id: string) =>
      getCollectingEvent$.next({
        id: id,
        collectionId: appSession.collectionId,
        token: appSession.accessToken,
        ajaxGet
      }),
    setDisabledState: (fieldName: string) => (value: boolean) =>
      setDisabledState$.next({ fieldName, value }),
    setDraftState: (subState?: string) => (fieldName: string) => (value: boolean) =>
      setDraftState$.next({ subState: subState, fieldName: fieldName, value: value }),
    editEventDateRevision: (ajaxPost: AjaxPost<any>) => (
      props: EditCollectingEventProps
    ) => {
      editEventDateRevision$.next({
        id: props.id,
        data: props.data,
        token: props.token,
        collectionId: props.collectionId,
        ajaxPost,
        callback: props.callback
      });
    },
    editEventMetaData: (ajaxPost: AjaxPost<any>) => (props: EditCollectingEventProps) => {
      editEventMetaData$.next({
        id: props.id,
        data: props.data,
        token: props.token,
        collectionId: props.collectionId,
        ajaxPost,
        callback: props.callback
      });
    },
    editEventAttributesRevision: (ajaxPost: AjaxPost<any>) => (
      props: EditEventAttributesProps
    ) => {
      editEventAttributesRevision$.next({
        id: props.id,
        data: props.data,
        token: props.token,
        collectionId: props.collectionId,
        ajaxPost,
        callback: props.callback
      });
    },
    editEventPersonRevision: (ajaxPost: AjaxPost<any>) => (
      props: EditPersonEventProps
    ) => {
      console.log('IN editEventPersonRevision ', props.data);
      editEventPersonRevision$.next({
        id: props.id,
        data: props.data,
        token: props.token,
        collectionId: props.collectionId,
        ajaxPost,
        callback: props.callback
      });
    },
    editEventPlaceRevision: (ajaxPost: AjaxPost<any>) => (props: EditPlaceProps) => {
      editEventPlaceRevision$.next({
        id: props.id,
        data: props.data,
        token: props.token,
        collectionId: props.collectionId,
        ajaxPost,
        callback: props.callback
      });
    },

    addPersonName: (ajaxPost: AjaxPost<any>) => (props: AddPersonNameProps) =>
      addPersonName$.next({
        data: props.data,
        token: props.token,
        collectionId: props.collectionId,
        ajaxPost,
        callback: props.callback
      }),
    addPerson: (ajaxPost: AjaxPost<any>) => (props: AddPersonProps) =>
      addPerson$.next({
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
      })
  };
};

export const onMountProps = () => (props: any) => {
  props.getCollectingEvent()(props.appSession, props.match.params.id);
};

export const onUnmount = () => (props: any) => {};

const ManageCollectingEventComponent = lifeCycle({
  onMount: onMountProps(),
  onUnmount
})(CollectingEventComponent);

export default flowRight([
  inject(combinedStore$, editCollectingEventProps),
  loadPredefinedCollectingEventValues
])(ManageCollectingEventComponent);
