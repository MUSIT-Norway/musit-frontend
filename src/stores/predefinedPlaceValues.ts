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
