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
  setDisabledState$
} from './CollectingEventStore';
import { History } from 'history';
import { AjaxPost } from '../../../types/ajax';
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

const addCollectingEventProps = (combinedStore: any, upstream: { history: History }) => ({
  ...combinedStore,
  ...upstream,
  store: { ...combinedStore, localState: undefined },

  eventDataReadOnly: true,
  placeReadOnly: true,
  personReadOnly: true,
  addStateReadOnly: false,
  setDisabledState: (fieldName: string) => (value: boolean) =>
    setDisabledState$.next({ fieldName, value }),
  addCollectingEvent: (ajaxPost: AjaxPost<any>) => (props: AddCollectingEventProps) =>
    addCollectingEvent$.next({
      data: props.data,
      token: props.token,
      collectionId: props.collectionId,
      ajaxPost,
      callback: props.callback
    })
});

export const onMountProps = () => (props: any) => {};

export const onUnmount = () => (props: any) => {};

const ManageCollectingEventsComponent = lifeCycle({
  onMount: onMountProps(),
  onUnmount
})(CollectingEventComponent);

export default flowRight([
  inject(combinedStore$, addCollectingEventProps),
  loadPredefinedCollectingEventValues
])(ManageCollectingEventsComponent);
