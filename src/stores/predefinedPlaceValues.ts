import { Observable, Subject } from 'rxjs';
import {
  loadDatum,
  loadCoordinateSources,
  loadCoordinateTypes,
  loadGeomertryTypes
} from '../models/object/place';

import { createStore } from 'react-rxjs';
import { createAction } from '../shared/react-rxjs-patch';
import { Reducer } from 'react-rxjs';
import { KEEP_ALIVE } from './constants';
import { Predefined } from '../types/predefined';
import { simpleGet } from '../shared/RxAjax';
import { Star, TODO } from '../types/common';
import { coordinateSources } from 'src/modules/object/places/PlaceComponent';

export type PredefinedPlaceValues = {
  datums: string[];
  coordinateTypes: string[];
  coordinateSources: string[];
  geometryTypes: string[];
};

type PredefinedPlaceState = PredefinedPlaceValues & {
  loadingDatum: boolean;
  loadingGeometryTypes: boolean;
  loadingCoordinateTypes: boolean;
  loadingCoordinateSources: boolean;
};

export const initialState: PredefinedPlaceState = {
  loadingDatum: false,
  loadingCoordinateSources: false,
  loadingCoordinateTypes: false,
  loadingGeometryTypes: false,
  datums: [],
  coordinateSources: [],
  geometryTypes: [],
  coordinateTypes: []
};

export const setLoadingDatumTypes$: Subject<Star> = createAction('setLoadingDatumTypes$');
export const loadDatumTypes$: Subject<Star> = createAction('loadDatumTypes$');
const loadDatumTypesAction$: Observable<Star> = loadDatumTypes$.switchMap(
  loadDatum(simpleGet)
);
export const setLoadingCoordinateTypes$: Subject<Star> = createAction(
  'setLoadingCoordinateTypes$'
);
export const loadCoordinateTypes$: Subject<Star> = createAction('loadCoordinateTypes$');
const loadCoordinateTypesAction$: Observable<Star> = loadCoordinateTypes$.switchMap(
  loadCoordinateTypes(simpleGet)
);

export const setLoadCoordinateSources$: Subject<Star> = createAction(
  'setLoadCoordinateSources$'
);
export const loadCoordinateSources$: Subject<Star> = createAction(
  'loadCoordinateSources$'
);
const loadCoordinateSourcesAction$: Observable<Star> = loadCoordinateSources$.switchMap(
  loadCoordinateSources(simpleGet)
);

export const setLoadGeomertryTypes$: Subject<Star> = createAction(
  'setLoadGeomertryTypes$'
);
export const loadGeomertryTypes$: Subject<Star> = createAction('loadGeomertryTypes$');
const loadGeometryTypesAction$: Observable<Star> = loadGeomertryTypes$.switchMap(
  loadGeomertryTypes(simpleGet)
);

export function reducer$(actions: {
  [key: string]: Observable<Star>;
}): Observable<Reducer<any>> {
  return Observable.merge(
    actions.setLoadingDatumTypes$.map(() => (state: PredefinedPlaceState) => ({
      ...state,
      loadingDatum: true
    })),
    actions.loadDatums$.map((datums: string[]) => (state: PredefinedPlaceState) => ({
      ...state,
      datums,
      loadingDatum: false
    })),
    actions.setLoadingCoordinateTypes$.map(() => (state: PredefinedPlaceState) => ({
      ...state,
      loadingCoordinateTypes: true
    })),
    actions.loadCoordinateTypes$.map(
      (cooordinateTypes: string[]) => (state: PredefinedPlaceState) => ({
        ...state,
        cooordinateTypes,
        loadingCoordinateTypes: false
      })
    ),
    actions.setLoadCoordinateSources$.map(() => (state: PredefinedPlaceState) => ({
      ...state,
      loadingCoordinateSources: true
    })),
    actions.loadCoordinateSources$.map(
      (coordinateSources: string[]) => (state: PredefinedPlaceState) => ({
        ...state,
        coordinateSources,
        loadingCoordinateSources: false
      })
    ),
    actions.setLoadGeomertryTypes$.map(() => (state: PredefinedPlaceState) => ({
      ...state,
      loadingGeometryTypes: true
    })),
    actions.loadingGeometryTypes$.map(
      (geometryTypes: string[]) => (state: PredefinedPlaceState) => ({
        ...state,
        geometryTypes,
        loadingGeometryTypes: false
      })
    )
  );
}

export const store$ = (actions: { [key: string]: Observable<Star> }) =>
  createStore('predefinedPlaceValues', reducer$(actions), initialState, KEEP_ALIVE);

const predefined$ = store$({
  setLoadingDatumTypes$,
  loadDatum$: loadDatumTypesAction$,
  setLoadCoordinateSources$,
  loadCoordinateSources$: loadCoordinateSourcesAction$,
  setLoadGeomertryTypes$,
  loadGeomertryTypes$: loadGeometryTypesAction$,
  setLoadingCoordinateTypes$,
  loadCoordinateTypes$: loadCoordinateTypesAction$
});

export default predefined$;
