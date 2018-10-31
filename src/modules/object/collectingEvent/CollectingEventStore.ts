import {
  InputEvent,
  addCollectingEvent,
  CollectingEvent
} from '../../../models/object/collectingEvent';
import { /* place , addPlace, */ InputPlace } from '../../../models/object/place';
import { CollectingEventState } from './CollectingEvents';
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
  collectingEvent?: InputEvent & InputPlace;
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

export type AddCollectingEventProps = CommonParams & { data: CollectingEventState };

export const toBackend: ((p: CollectingEvent) => InputEvent) = (p: CollectingEvent) => {
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
) =>
  Observable.of(props).flatMap(props =>
    addCollectingEvent(ajaxPost)({
      data: toBackend(props.data.eventState),
      token: props.token,
      callback: props.callback
    })
  );

/* export const toBackendPlace: ((p: PlaceState) => InputPlace) = (p: PlaceState) => {
    const c = new place(
     '',
     p.admPlace && p.admPlace.admPlaceUuid,
     {
      coordinateUuid: '',
      coordinateType: p.editingCoordinate && p.editingCoordinate.coordinateType,
      datum: p.editingCoordinate && p.editingCoordinate.datum,
      zone: p.editingCoordinate && p.editingCoordinate.utmZone,
      bend: p.editingCoordinate && p.editingCoordinate.mgrsBand,
      coordinateString: p.editingCoordinate && p.editingCoordinate.coordinateString,
      coordinateGeometry: p.editingCoordinate && p.editingCoordinate.coordinateGeomertry
     },
     {
       coordAttrUuid: '',
       coordinateSource: p.editingCoordinate && p.editingCoordinate.coordinateSource,
       gpsAccuracy: p.editingCoordinate && p.editingCoordinate.gpsAccuracy,
       addedLater: p.editingCoordinate && p.editingCoordinate.gpsAccuracy,
       coordinateCa: p.editingCoordinate && p.editingCoordinate.caCoordinate,
       precision: p.editingCoordinate && p.editingCoordinate.coordinatePrecision,
       altitudeString: '',
       altitudeFrom:  p.editingCoordinate && p.editingCoordinate.altitudeLow,
       altitudeTo:  p.editingCoordinate && p.editingCoordinate.altitudeHigh,
       altitudeUnit: p.editingCoordinate && p.editingCoordinate.altitudeUnit,
       derivedAltitudeMeter: '',
       depthString: '',
       depthFrom: p.editingCoordinate && p.editingCoordinate.depthLow,
       depthTo: p.editingCoordinate && p.editingCoordinate.depthHigh,
       depthUnit: p.editingCoordinate && p.editingCoordinate.depthUnit,
       derivedDepthMeter: '',
       note: p.editingCoordinate && p.editingCoordinate.coordinateNote
     }
    );
    console.log('to backend ', c);
    return c;
  };

const addPlaceData = (ajaxPost: AjaxPost<Star>) => (
  props: AddCollectingEventProps
) =>
  Observable.of(props)
  .flatMap(props => addPlace(ajaxPost)
    ({
      data: toBackendPlace(props.data.placeState),
      token: props.token,
      callback: props.callback
    })
  ); */

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
      .map((collectingEvent: InputEvent) => (state: CollectingEventStoreState) => ({
        ...state,
        collectingEvent
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
