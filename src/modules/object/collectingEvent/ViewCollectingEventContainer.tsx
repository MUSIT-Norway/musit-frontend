import { inject, createStore } from 'react-rxjs';
import { Observable } from 'rxjs';
import CollectingEventComponent from './CollectingEventComponent';
import { flowRight } from 'lodash';
import lifeCycle from '../../../shared/lifeCycle';
import appSession$ from '../../../stores/appSession';
import store$, { getCollectingEvent$ } from './CollectingEventStore';
import { AppSession } from '../../../types/appSession';
import { History } from 'history';
import { simpleGet } from '../../../shared/RxAjax';

const combinedStore$ = createStore(
  'combinedStore',
  Observable.combineLatest(appSession$, store$, (appSession, store) => () => ({
    appSession,
    store
  }))
);

const addProps = (combinedStore: any, upstream: { history: History }) => ({
  ...combinedStore,
  ...upstream,
  getCollectingEvent: (appSession: AppSession, id: string) =>
  getCollectingEvent$.next({
      id: id,
      collectionId: appSession.collectionId,
      token: appSession.accessToken,
      ajaxGet: simpleGet
    }),
  readOnly: true
});

export const onMountProps = () => (props: any) => {
  props.getCollectingEvent(props.appSession, props.match.params.id);
};

export const onUnmount = () => (props: any) => {};

const ManagedConservationFormComponent = lifeCycle({
  onMount: onMountProps(),
  onUnmount
})(CollectingEventComponent);

export default flowRight([inject(combinedStore$, addProps)])(
  ManagedConservationFormComponent
);
