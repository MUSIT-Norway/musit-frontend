import { inject, createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import { flowRight } from 'lodash';
import lifeCycle from '../../../shared/lifeCycle';
import appSession$ from '../../../stores/appSession';
import { loadPredefinedPlaceValues } from '../../../stores/loadPredefinedPlaceValues';
import predefinedPlaceValues$ from '../../../stores/predefinedPlaceValues';
import store$, {
  addCollectingEvent$,
  AddCollectingEventProps
} from './CollectingEventStore';
import { History } from 'history';
import { AjaxPost } from '../../../types/ajax';
import { CollectingEventComponent } from './CollectingEventComponent';

const combinedStore$ = createStore(
  'combinedStore',
  Observable.combineLatest(
    appSession$,
    predefinedPlaceValues$,
    store$,
    (appSession, predefinedPlaceValues, store) => () => ({
      appSession,
      predefinedPlaceValues,
      store
    })
  )
);

const addCollectingEventProps = (combinedStore: any, upstream: { history: History }) => ({
  ...combinedStore,
  ...upstream,
  store: { ...combinedStore, localState: undefined },
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
  loadPredefinedPlaceValues
])(ManageCollectingEventsComponent);
