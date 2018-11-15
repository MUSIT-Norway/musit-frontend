import {
  getCollectingEvent,
  addCollectingEvent,
  CollectingEvent,
  InputCollectingEvent,
  OutputCollectingEvent,
  editEventDateRivision
} from '../../../models/object/collectingEvent';
import { addPlace, InputPlace, inputPlace } from '../../../models/object/place';
import { CollectingEventState, EventState } from './CollectingEventComponent';
import { Callback, AjaxGet, AjaxPost, AjaxPut } from '../../../types/ajax';
import { Star } from '../../../types/common';
import { Observable, Subject } from 'rxjs';
import { createAction } from '../../../shared/react-rxjs-patch';
import { Reducer } from 'react-rxjs';
import { simpleGet, simplePost, simplePut} from '../../../shared/RxAjax';
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

export type GetCollectingEventProps = CommonParams & { id: string };
export type AddCollectingEventProps = CommonParams & { data: EventState };
export type EditCollectingEventProps = CommonParams & { data: EventState; id: string; };

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
  props: GetCollectingEventProps
) =>
  Observable.of(props).flatMap(props =>
    getCollectingEvent(ajaxGet)({
      id: props.id,
      token: props.token,
      callback: props.callback
    })
  );

const addCollectingEventData = (ajaxPost: AjaxPost<Star>) => (
  props: AddCollectingEventProps
) => {
  const ip: InputPlace = new inputPlace(
    undefined,
    props.data.placeState.admPlace
      ? props.data.placeState.admPlace.admPlaceUuid
      : undefined,
    props.data.placeState.editingInputCoordinate,
    props.data.placeState.editingCoordinateAttribute,
    props.data.placeState.editingAttributes
  );
  return Observable.of(props).flatMap(props =>
    addPlace(ajaxPost)({
      data: ip,
      token: props.token
    }).flatMap(({ placeUuid }) =>
      addCollectingEvent(ajaxPost)({
        data: { ...toBackend(props.data), placeUuid: placeUuid },
        token: props.token,
        callback: props.callback
      })
    )
  );
};

const editEventDateRivisionData = (ajaxPut: AjaxPut<Star>) => (props: EditCollectingEventProps) =>
  Observable.of(props).flatMap(props =>
    editEventDateRivision(ajaxPut)({
      id: props.id,
      data: props.data, //toBackend(props.data),
      token: props.token,
      callback: props.callback
    })
  );

export const addCollectingEvent$: Subject<
  AddCollectingEventProps & { ajaxPost: AjaxPost<Star> }
> = createAction('addCollectingEvent$');

export const getCollectingEvent$: Subject<
  GetCollectingEventProps & { ajaxGet: AjaxGet<Star> }
> = createAction('getCollectingEvent$');

export const editEventDateRivision$: Subject<
  EditCollectingEventProps & {
    ajaxPut: AjaxPut<Star>;
  }
> = createAction('editEventDateRivision$');

type Actions = {
  getCollectingEvent$: Subject<GetCollectingEventProps>;
  addCollectingEvent$: Subject<AddCollectingEventProps>;
  editEventDateRivision$: Subject<EditCollectingEventProps>;
};

export const reducer$ = (
  actions: Actions,
  ajaxGet: AjaxGet<Star>,
  ajaxPost: AjaxPost<Star>,
  ajaxPut: AjaxPut<Star>
): Observable<Reducer<CollectingEventStoreState>> => {
  return Observable.merge(
    actions.getCollectingEvent$
      .switchMap(getCollectingEventData(ajaxGet))
      .map((outEvent: OutputCollectingEvent) => (state: CollectingEventStoreState) => ({
        ...state,
        eventState: outEvent,
        localState: toFrontend(outEvent)
      })),
    actions.addCollectingEvent$
      .switchMap(addCollectingEventData(ajaxPost))
      .map(
        (collectingEvent: InputCollectingEvent) => (
          state: CollectingEventStoreState
        ) => ({
          ...state,
          eventState: collectingEvent
        })
      ),
      actions.editEventDateRivision$
      .switchMap(editEventDateRivisionData(ajaxPut))
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
    addCollectingEvent$,
    editEventDateRivision$
  },
  ajaxGet: AjaxGet<Star> = simpleGet,
  ajaxPost: AjaxPost<Star> = simplePost,
  ajaxPut: AjaxPost<Star> = simplePut
) => {
  return createStore(
    'collectingEventStore',
    reducer$(actions$, ajaxGet, ajaxPost, ajaxPut),
    initialCollectingEventState,
    KEEP_ALIVE
  );
};

const storeSingleton = store$();
export default storeSingleton;
