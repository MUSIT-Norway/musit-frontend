// @flow
import { simpleGet, simplePost, simplePut } from '../../shared/RxAjax';
import { Observable, Subject } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import type { Reducer } from 'react-rxjs/dist/RxStore';
import MusitAnalysis from '../../models/analysis';
import uniq from 'lodash/uniq';
import MusitActor from '../../models/actor';
import MusitObject from '../../models/object';
import Sample from '../../models/sample';
import flatten from 'lodash/flatten';
import type { Callback, AjaxGet, AjaxPost } from '../../types/ajax';
import type {
  AnalysisCollection,
  AnalysisType,
  ObjectInfo,
  AffectedThing
} from '../../types/analysis';
import type { Purposes, Categories, AnalysisLabList } from '../../types/predefined';
import type { Actor } from '../../types/actor';
import type { SampleType } from 'types/sample';

export type AnalysisStoreState = {
  analysisTypes?: Array<AnalysisType>,
  loading?: boolean,
  purposes?: Purposes,
  categories?: Categories,
  analysisLabList?: AnalysisLabList,
  analysisTypeCategories?: Array<string>,
  extraDescriptionAttributes?: any,
  extraResultAttributes?: any,
  analysis?: ?AnalysisCollection,
  showRestrictionCancelDialog?: ?boolean
};

export const initialState: AnalysisStoreState = {
  analysisTypes: [],
  purposes: [],
  categories: {
    raw: []
  },
  analysisLabList: [],
  loading: false,
  extraDescriptionAttributes: {},
  extraResultAttributes: {},
  analysisTypeCategories: [],
  analysis: null,
  showRestrictionCancelDialog: false
};

export const toggleCancelDialog$: Subject<*> = createAction('toggleCancelDialog$');

type Flag = { ['loadingAnalysis']: boolean };

const setLoading$: Subject<Flag> = createAction('setLoading$');

const flagLoading = s => () => setLoading$.next(s);

export const getAnalysisTypes$: Subject<*> = createAction('getAnalysisTypes$');
const getAnalysisTypesAction$: Observable<*> = getAnalysisTypes$.switchMap(
  MusitAnalysis.getAnalysisTypesForCollection(simpleGet)
);

export const getAnalysis$: Subject<*> = createAction('getAnalysis$');
const getAnalysisAction$: Observable<*> = getAnalysis$
  .do(flagLoading({ loadingAnalysis: true }))
  .switchMap(props =>
    MusitAnalysis.getAnalysisById(simpleGet)(props).flatMap(
      getAnalysisDetails(simpleGet, simplePost, props)
    )
  )
  .do(flagLoading({ loadingAnalysis: false }));

export const updateAnalysis$: Subject<*> = createAction('updateAnalysis$');
const updateAnalysisAction$: Observable<*> = updateAnalysis$
  .do(flagLoading({ loadingAnalysis: true }))
  .switchMap(MusitAnalysis.editAnalysisEvent(simplePut))
  .do(flagLoading({ loadingAnalysis: false }));

export const updateRestriction$: Subject<*> = createAction('updateRestriction$');
export const updateExtraDescriptionAttribute$: Subject<*> = createAction(
  'updateExtraDescriptionAttribute$'
);
export const clearStore$: Subject<*> = createAction('clearStore$');
export const updateExtraResultAttribute$: Subject<*> = createAction(
  'updateExtraResultAttribute$'
);

export const loadPredefinedTypes$ = createAction('loadPredefinedTypes$');
const loadPredefinedTypesAction$: Observable<*> = loadPredefinedTypes$.switchMap(props =>
  MusitAnalysis.loadPredefinedTypes(simpleGet)(props)
);

type Actions = {
  setLoading$: Subject<Flag>,
  getAnalysisAction$: Observable<*>,
  updateAnalysisAction$: Observable<*>,
  updateRestriction$: Subject<*>,
  getAnalysisTypesAction$: Observable<*>,
  loadPredefinedTypesAction$: Observable<*>,
  updateExtraDescriptionAttribute$: Subject<*>,
  updateExtraResultAttribute$: Subject<*>,
  clearStore$: Subject<*>,
  toggleCancelDialog$: Subject<*>
};

const updateResultAttribute = ({ name, value }) => state => ({
  ...state,
  extraResultAttributes: {
    ...state.extraResultAttributes,
    [name]: value.rawValue
      ? { ...value, value: parseFloat(value.rawValue.replace(',', '.')) }
      : value
  }
});

export const reducer$ = (actions: Actions): Observable<Reducer<AnalysisStoreState>> => {
  return Observable.merge(
    actions.toggleCancelDialog$.map(() => state => ({
      ...state,
      showRestrictionCancelDialog: !state.showRestrictionCancelDialog
    })),
    actions.setLoading$.map(loading => state => ({ ...state, ...loading })),
    actions.clearStore$.map(() => () => initialState),
    Observable.merge(
      actions.getAnalysisAction$,
      actions.updateAnalysisAction$
    ).map(analysis => state => ({
      ...state,
      analysis
    })),
    actions.updateRestriction$.map(restriction => state => ({
      ...state,
      analysis: {
        ...state.analysis,
        restriction
      }
    })),
    actions.getAnalysisTypesAction$.map(analysisTypes => state => ({
      ...state,
      analysisTypes,
      analysisTypeCategories: uniq(analysisTypes.map(a => a.category))
    })),
    actions.loadPredefinedTypesAction$.map(predefinedTypes => state => ({
      ...state,
      categories: predefinedTypes.categories,
      purposes: predefinedTypes.purposes,
      analysisTypes: predefinedTypes.analysisTypes,
      analysisLabList: predefinedTypes.analysisLabList
    })),
    actions.updateExtraDescriptionAttribute$.map(({ name, value }) => state => ({
      ...state,
      extraDescriptionAttributes: { ...state.extraDescriptionAttributes, [name]: value }
    })),
    actions.updateExtraResultAttribute$.map(updateResultAttribute)
  );
};

export const store$ = (
  actions$: Actions = {
    setLoading$,
    getAnalysisTypesAction$,
    getAnalysisAction$,
    updateAnalysisAction$,
    updateRestriction$,
    loadPredefinedTypesAction$,
    updateExtraDescriptionAttribute$,
    updateExtraResultAttribute$,
    clearStore$,
    toggleCancelDialog$
  }
) => createStore('analysisStore', reducer$(actions$), initialState);

const storeSingleton = store$();
export default storeSingleton;

type SampleTypes = {
  [string]: Array<SampleType>
};

export function getAnalysisDetails(
  ajaxGet: AjaxGet<*>,
  ajaxPost: AjaxPost<*>,
  props: {
    id: number,
    museumId: number,
    collectionId: string,
    token: string,
    callback?: Callback<*>,
    sampleTypes: SampleTypes
  }
): (analysis: AnalysisCollection) => Observable<*> {
  return (analysis: AnalysisCollection) =>
    MusitActor.getActors(ajaxPost)({
      actorIds: [
        analysis.registeredBy || '',
        analysis.updatedBy || '',
        analysis.doneBy || '',
        analysis.responsible || '',
        analysis.administrator || '',
        analysis.completedBy || '',
        analysis.restriction ? analysis.restriction.requester || '' : '',
        analysis.restriction && analysis.restriction.cancelledStamp
          ? analysis.restriction.cancelledStamp.user || ''
          : ''
      ].filter(p => p),
      token: props.token
    })
      .map(actors => {
        if (actors) {
          const actorNames = getActorNames(actors, analysis);
          if (analysis.restriction) {
            return {
              ...analysis,
              ...actorNames,
              restriction: { ...analysis.restriction, ...actorNames.restriction }
            };
          }
          return {
            ...analysis,
            ...actorNames
          };
        }
        return analysis;
      })
      .flatMap(analysis => {
        if (analysis.type === 'AnalysisCollection') {
          const events = analysis.events;
          if (events && events.length > 0) {
            // $FlowFixMe | We are passing an array to forkJoin which is not supported by flow-typed definition for rxjs.
            return Observable.forkJoin(
              events.map(getEventObjectDetails(props, ajaxGet))
            ).map(zipObjectInfoWithEvents(analysis));
          }
        }
        const objectId = analysis.objectId;
        if (!objectId) {
          return Observable.of(analysis);
        }
        return MusitObject.getObjectDetails(ajaxGet)({
          id: objectId,
          museumId: props.museumId,
          collectionId: props.collectionId,
          token: props.token
        }).map(({ response }) => {
          if (!response) {
            return analysis;
          }
          return {
            ...analysis,
            museumNo: response.museumNo,
            subNo: response.subNo,
            term: response.term
          };
        });
      });
}

type AjaxParams = {
  museumId: number,
  collectionId: string,
  token: string,
  sampleTypes: SampleTypes
};

function getEventObjectDetails(
  props: AjaxParams,
  ajaxGet: AjaxGet<*>
): (t: AffectedThing) => Observable<ObjectInfo> {
  return event => {
    const params = {
      id: event.affectedThing,
      museumId: props.museumId,
      collectionId: props.collectionId,
      token: props.token
    };
    return MusitObject.getObjectDetails(ajaxGet)(params).flatMap(objRes => {
      if (objRes.error) {
        return Sample.loadSample(ajaxGet)(params).flatMap(sample => {
          return MusitObject.getObjectDetails(ajaxGet)({
            ...params,
            id: sample.originatedObjectUuid
          }).map(sampleObjectRes => {
            const flattened = flatten(Object.values(props.sampleTypes));
            const sampleType = flattened.find(
              st => st.sampleTypeId === sample.sampleTypeId
            );
            return {
              sampleData: { ...sample, sampleType: sampleType },
              objectData: sampleObjectRes.response
            };
          });
        });
      }
      return Observable.of({ objectData: objRes.response });
    });
  };
}

export function zipObjectInfoWithEvents(analysis: AnalysisCollection) {
  return (arrayOfObjectDetails: Array<ObjectInfo>): AnalysisCollection => {
    const actualValues = arrayOfObjectDetails.filter(a => a);
    if (actualValues.length === 0) {
      return analysis;
    }
    const events = analysis.events
      ? analysis.events.map(e => {
          const od = arrayOfObjectDetails.find(objD => {
            return (
              (objD.sampleData && objD.sampleData.objectId === e.affectedThing) ||
              (objD.objectData && objD.objectData.uuid === e.affectedThing)
            );
          });
          return od ? { ...od, ...e } : e;
        })
      : [];
    return { ...analysis, events: events };
  };
}

export function getActorNames(actors: Array<Actor>, analysis: AnalysisCollection) {
  return MusitActor.getMultipleActorNames(actors, [
    {
      id: analysis.updatedBy || '',
      fieldName: 'updatedByName'
    },
    {
      id: analysis.registeredBy || '',
      fieldName: 'registeredByName'
    },
    {
      id: analysis.doneBy || '',
      fieldName: 'doneByName'
    },
    {
      id: analysis.responsible || '',
      fieldName: 'responsibleName'
    },
    {
      id: analysis.administrator || '',
      fieldName: 'administratorName'
    },
    {
      id: analysis.completedBy || '',
      fieldName: 'completedByName'
    },
    {
      id: analysis.restriction ? analysis.restriction.requester || '' : '',
      fieldName: 'restriction_requesterName'
    },
    {
      id:
        analysis.restriction && analysis.restriction.cancelledStamp
          ? analysis.restriction.cancelledStamp.user || ''
          : '',
      fieldName: 'restriction_cancelledByName'
    }
  ]);
}
