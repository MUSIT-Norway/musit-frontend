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
  editEventPlaceRevision$,
  EditCollectingEventProps,
  getCollectingEvent$,
  setDisabledState$,
  setDraftState$
} from './CollectingEventStore';
import { History } from 'history';
import { AjaxPut } from '../../../types/ajax';
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
  console.log('Local storage: ', localStorage);
  return {
    ...combinedStore,
    ...upstream,
    eventDataReadOnly:
      localStorage.getItem('editComponent') === 'eventMetaData' ? false : true,
    placeReadOnly: localStorage.getItem('editComponent') === 'place' ? false : true,
    personReadOnly: localStorage.getItem('editComponent') === 'person' ? false : true,
    addStateHidden: true,
    store: { ...combinedStore, localState: undefined },

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
    editEventDateRevision: (ajaxPut: AjaxPut<any>) => (
      props: EditCollectingEventProps
    ) => {
      editEventDateRevision$.next({
        id: props.id,
        data: props.data,
        token: props.token,
        collectionId: props.collectionId,
        ajaxPut,
        callback: props.callback
      });
    },
    editEventPlaceRevision: (ajaxPut: AjaxPut<any>) => (
      props: EditCollectingEventProps
    ) => {
      editEventPlaceRevision$.next({
        id: props.id,
        data: props.data,
        token: props.token,
        collectionId: props.collectionId,
        ajaxPut,
        callback: props.callback
      });
    }
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
