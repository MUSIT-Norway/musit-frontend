import {
  getCollectingEvent,
  addCollectingEvent,
  CollectingEvent,
  InputCollectingEvent,
  OutputCollectingEvent
} from '../../../models/object/collectingEvent';
import { addPlace, InputPlace, inputPlace } from '../../../models/object/place';
import { CollectingEventState, EventState } from './CollectingEventComponent';
import { Callback, AjaxGet, AjaxPost } from '../../../types/ajax';
import { Star } from '../../../types/common';
import { Observable, Subject } from 'rxjs';
import { createAction } from '../../../shared/react-rxjs-patch';
import { Reducer } from 'react-rxjs';
import { simpleGet , simplePost } from '../../../shared/RxAjax';
import { KEEP_ALIVE } from '../../../stores/constants';
import { createStore } from 'react-rxjs';
import { toFrontend } from '../collectingEvent/CollectingEventComponent';

export type CollectingEventStoreState = {
  localState?: CollectingEventState;
  collectingEvent?: InputCollectingEvent;
  collectingEventList?: Array<InputCollectingEvent>;
};
export type CollectingEventMethod = {
  methodId: number;
  method: string;
};

export type PredefinedCollectingEventValues = {
  datums: { datum: string }[] | null;
  coordinateTypes: { type_text: string }[] | null;
  coordinateSources: { source: string }[] | null;
  geometryTypes: { geometry: string }[] | null;
  collectingMethods: CollectingEventMethod[] | null;
};
export const initialCollectingEventState = {
  collectingEvent: {
    eventType: 6,
    name: ''
  }
};

export type CommonParams = {
  collectionId: string;
  token: string;
  callback?: Callback<Star>;
};

export type GetCollectingEventProps = CommonParams & { id : string };
export type AddCollectingEventProps = CommonParams & { data: EventState };

export const toBackend: ((p: EventState) => InputCollectingEvent) = (p: EventState) => {
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
    p.placeState.placeUuid
  );
  console.log('to backend ', c);
  return c;
};

const getCollectingEventData = (ajaxGet: AjaxGet<Star>) => (
  props: GetCollectingEventProps) =>
  Observable.of(props).flatMap(props =>
    getCollectingEvent(ajaxGet)({ id: props.id, token: props.token, callback: props.callback })
    .do((response) => console.log('&&&&&& Response getCollectingEventData ', response)
    )
  );


const addCollectingEventData = (ajaxPost: AjaxPost<Star>) => (
  props: AddCollectingEventProps
) => {
  const ip: InputPlace = new inputPlace(
    undefined,
    props.data.placeState.admPlace
      ? props.data.placeState.admPlace.admPlaceUuid
      : undefined,
    props.data.placeState.editingInputCoordinate
  );
  return Observable.of(props).flatMap(props =>
    addPlace(ajaxPost)({
      data: ip,
      token: props.token,
      callback: props.callback
    }).flatMap(({ placeUuid }) =>
      addCollectingEvent(ajaxPost)({
        data: { ...toBackend(props.data), placeUuid: placeUuid },
        token: props.token
      })
    )
  );
};

export const addCollectingEvent$: Subject<
  AddCollectingEventProps & { ajaxPost: AjaxPost<Star> }
> = createAction('addCollectingEvent$');

export const getCollectingEvent$: Subject<
  GetCollectingEventProps & { ajaxGet: AjaxGet<Star> }
> = createAction('getCollectingEvent$');

type Actions = {
  getCollectingEvent$: Subject<GetCollectingEventProps>;
  addCollectingEvent$: Subject<AddCollectingEventProps>;
};

export const reducer$ = (
  actions: Actions,
  ajaxGet: AjaxGet<Star>,
  ajaxPost: AjaxPost<Star>
): Observable<Reducer<CollectingEventStoreState>> => {
  return Observable.merge(
    actions.getCollectingEvent$
    .switchMap(getCollectingEventData(ajaxGet))
    .map((outEvent: OutputCollectingEvent ) => (state: CollectingEventStoreState) => ({
      ...state,
      eventState: outEvent,
      localState: toFrontend(outEvent)
    })),
    actions.addCollectingEvent$
      .switchMap(addCollectingEventData(ajaxPost))
      .do(res => console.log('HTTP response:', res))
      .map(
        (collectingEvent: InputCollectingEvent) => (
          state: CollectingEventStoreState
        ) => ({
          ...state,
          eventState: collectingEvent
        })
      )
  );
};

export const store$ = (
  actions$: Actions = {
    getCollectingEvent$,
    addCollectingEvent$
  },
  ajaxGet: AjaxGet<Star> = simpleGet,
  ajaxPost: AjaxPost<Star> = simplePost
) => {
  return createStore(
    'collectingEventStore',
    reducer$(actions$, ajaxGet, ajaxPost),
    initialCollectingEventState,
    KEEP_ALIVE
  );
};

const storeSingleton = store$();
export default storeSingleton;
