import {
  InputEvent,
  addCollectingEvent,
  CollectingEvent
} from '../../../models/object/collectingEvent';
//import { /* place , addPlace, */ InputPlace } from '../../../models/object/place';
import { CollectingEventState, EventState } from './CollectingEventComponent';
import { Callback, AjaxPost } from '../../../types/ajax';
import { Star } from '../../../types/common';
import { Observable, Subject } from 'rxjs';
import { createAction } from '../../../shared/react-rxjs-patch';
import { Reducer } from 'react-rxjs';
import { simplePost } from '../../../shared/RxAjax';
import { KEEP_ALIVE } from '../../../stores/constants';
import { createStore } from 'react-rxjs';

export type CollectingEventStoreState = {
  localState?: CollectingEventState;
  collectingEvent?: InputEvent;
  collectingEventList?: Array<InputEvent>;
};
export const initialCollectingEventState = {
  collectingEventList: []
};

export type CommonParams = {
  collectionId: string;
  token: string;
  callback?: Callback<Star>;
};

export type AddCollectingEventProps = CommonParams & { data: EventState };

export const toBackend: ((p: EventState) => InputEvent) = (p: EventState) => {
  const c = new CollectingEvent(
    p.name,
    p.eventUuid,
    p.eventType,
    p.methodId,
    p.method,
    p.methodDescription,
    p.museumId,
    p.collectionId,
    p.note,
    p.partOf,
    p.createdBy,
    p.createdDate,
    p.relatedActors,
    p.eventDateFrom,
    p.eventDateTo,
    p.eventDateVerbatim,
    p.placeUuid
  );
  console.log('to backend ', c);
  return c;
};

const addCollectingEventData = (ajaxPost: AjaxPost<Star>) => (
  props: AddCollectingEventProps
) => {
  console.log('Inside addCollectingEventData ');
  return Observable.of(props).flatMap(props =>
    addCollectingEvent(ajaxPost)({
      data: toBackend(props.data),
      token: props.token,
      callback: props.callback
    })
  );
};

export const addCollectingEvent$: Subject<
  AddCollectingEventProps & { ajaxPost: AjaxPost<Star> }
> = createAction('addCollectingEvent$');

type Actions = {
  addCollectingEvent$: Subject<AddCollectingEventProps>;
};

export const reducer$ = (
  actions: Actions,
  ajaxPost: AjaxPost<Star>
): Observable<Reducer<CollectingEventStoreState>> => {
  return Observable.merge(
    actions.addCollectingEvent$
      .switchMap(addCollectingEventData(ajaxPost))
      .do(res => console.log('HTTP response:', res))
      .map((collectingEvent: InputEvent) => (state: CollectingEventStoreState) => ({
        ...state,
        eventState: collectingEvent
      }))
  );
};

export const store$ = (
  actions$: Actions = {
    addCollectingEvent$
  },
  ajaxPost: AjaxPost<Star> = simplePost
) => {
  return createStore(
    'collectingEventStore',
    reducer$(actions$, ajaxPost),
    initialCollectingEventState,
    KEEP_ALIVE
  );
};

const storeSingleton = store$();
export default storeSingleton;
