import { inject, createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import CollectingEventComponent from './CollectingEventComponent';
import { flowRight } from 'lodash';
import lifeCycle from '../../../shared/lifeCycle';
import appSession$ from '../../../stores/appSession';
import { loadPredefinedCollectingEventValues } from '../../../stores/loadPredefinedCollectingEventValues';
import predefinedCollectingEventValues$ from '../../../stores/predefinedCollectingEventValues';
import store$, {
  getCollectingEvent$,
  setDisabledState$,
  setDraftState$
} from './CollectingEventStore';
import { AppSession } from '../../../types/appSession';

import { simpleGet } from '../../../shared/RxAjax';
import { Callback } from 'src/types/ajax';
import { Star } from '../../../types/common';
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

const viewProps = (combinedStore: any, upstream: any) => {
  console.log('Upstream', upstream);
  return {
    ...combinedStore,
    ...upstream,
    getCollectingEvent: (ajaxGet = simpleGet) => (
      appSession: AppSession,
      id: string,
      callback?: Callback<Star>
    ) =>
      getCollectingEvent$.next({
        id: id,
        collectionId: appSession.collectionId,
        token: appSession.accessToken,
        ajaxGet,
        callback: callback
          ? {
              onComplete: callback.onComplete,
              onFailure: callback.onFailure
            }
          : undefined
      }),
    asyncGetPersonId: async (ajaxGet = simpleGet) => (
      appSession: AppSession,
      id: string
    ) =>
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
    eventDataReadOnly: true,
    placeReadOnly: true,
    personReadOnly: true,
    addStateHidden: true,
    placeCollapsed: false,
    eventDataCollapsed: false,
    personCollapsed: false
  };
};

export const onMountProps = () => (props: any) => {
  props.getCollectingEvent()(props.appSession, props.match.params.id);
};

export const onUnmount = () => (props: any) => {};

const ManagedCollectingEventComponent = lifeCycle({
  onMount: onMountProps(),
  onUnmount
})(CollectingEventComponent);

export default flowRight([
  inject(combinedStore$, viewProps),
  loadPredefinedCollectingEventValues
])(ManagedCollectingEventComponent);
