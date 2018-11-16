import { inject, createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import { flowRight } from 'lodash';
import lifeCycle from '../../../shared/lifeCycle';
import appSession$ from '../../../stores/appSession';
import { loadPredefinedCollectingEventValues } from '../../../stores/loadPredefinedCollectingEventValues';
import predefinedCollectingEventValues$ from '../../../stores/predefinedCollectingEventValues';
import store$, {
  editEventDateRivision$,
  editEventPlaceRivision$,
  EditCollectingEventProps
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
  editEventDateRivision: (ajaxPut: AjaxPut<any>) => (props: EditCollectingEventProps) => {
    editEventDateRivision$.next({
      id: props.id,
      data: props.data,
      token: props.token,
      collectionId: props.collectionId,
      ajaxPut,
      callback: props.callback
    });
  },
  editEventPlaceRivision: (ajaxPut: AjaxPut<any>) => (
    props: EditCollectingEventProps
  ) => {
    editEventPlaceRivision$.next({
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
