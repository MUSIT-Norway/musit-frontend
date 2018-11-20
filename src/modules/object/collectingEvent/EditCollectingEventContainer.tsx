import { inject, createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import { flowRight } from 'lodash';
import lifeCycle from '../../../shared/lifeCycle';
import appSession$ from '../../../stores/appSession';
import { loadPredefinedCollectingEventValues } from '../../../stores/loadPredefinedCollectingEventValues';
import predefinedCollectingEventValues$ from '../../../stores/predefinedCollectingEventValues';
import store$, {
  editEventDateRevision$,
  editEventPlaceRevision$,
  EditCollectingEventProps,
  setDisabledState$,
  setDraftState$
} from './CollectingEventStore';
import { History } from 'history';
import { AjaxPut } from '../../../types/ajax';
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

const editCollectingEventProps = (
  combinedStore: any,
  upstream: { history: History }
) => ({
  ...combinedStore,
  ...upstream,

  store: { ...combinedStore, localState: undefined },
  setDisabledState: (fieldName: string) => (value: boolean) =>
    setDisabledState$.next({ fieldName, value }),
  setDraftState: (subState?: string) => (fieldName: string) => (value: boolean) =>
    setDraftState$.next({ subState: subState, fieldName: fieldName, value: value }),
  editEventDateRevision: (ajaxPut: AjaxPut<any>) => (props: EditCollectingEventProps) => {
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
});

export const onMountProps = () => (props: any) => {};

export const onUnmount = () => (props: any) => {};

const ManageCollectingEventsComponent = lifeCycle({
  onMount: onMountProps(),
  onUnmount
})(CollectingEventComponent);

export default flowRight([
  inject(combinedStore$, editCollectingEventProps),
  loadPredefinedCollectingEventValues
])(ManageCollectingEventsComponent);
