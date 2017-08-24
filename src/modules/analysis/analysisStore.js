// @flow
import { simpleGet, simplePost, simplePut } from '../../shared/RxAjax';
import { Observable, Subject } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import MusitAnalysis from '../../models/analysis';
import uniq from 'lodash/uniq';
import MusitActor from '../../models/actor';
import MusitObject from '../../models/object';
import Sample from '../../models/sample';
import flatten from 'lodash/flatten';
import type { Callback, AjaxGet, AjaxPost } from '../../models/types/ajax';
import type { AnalysisCollection } from '../../types/analysis';
import type { Actor } from '../../types/actor';
import type { SampleType } from 'types/sample';

const initialState = {
  analysisTypes: [],
  purposes: [],
  categories: {},
  analysisLabList: [],
  loading: false,
  extraDescriptionAttributes: {},
  extraResultAttributes: {},
  analysisTypeCategories: []
};

export const toggleCancelDialog$: Subject<*> = createAction('toggleCancelDialog$');

const setLoading$: Subject<*> = createAction('setLoading$');

const flagLoading = s => () => setLoading$.next(s);

export const getAnalysisTypes$: Subject<*> = createAction('getAnalysisTypes$').switchMap(
  MusitAnalysis.getAnalysisTypesForCollection(simpleGet)
);

export const getAnalysis$: Subject<*> = createAction('getAnalysis$')
  .do(flagLoading({ loadingAnalysis: true }))
  .switchMap(props =>
    MusitAnalysis.getAnalysisById(simpleGet)(props).flatMap(
      getAnalysisDetails(simpleGet, simplePost, props)
    )
  )
  .do(flagLoading({ loadingAnalysis: false }));

export const updateAnalysis$: Subject<*> = createAction('updateAnalysis$')
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

export const loadPredefinedTypes$: Subject<*> = createAction(
  'loadPredefinedTypes$'
).switchMap(props => MusitAnalysis.loadPredefinedTypes(simpleGet)(props));

type Actions = {
  setLoading$: Subject<*>,
  getAnalysis$: Subject<*>,
  updateAnalysis$: Subject<*>,
  updateRestriction$: Subject<*>,
  getAnalysisTypes$: Subject<*>,
  loadPredefinedTypes$: Subject<*>,
  updateExtraDescriptionAttribute$: Subject<*>,
  updateExtraResultAttribute$: Subject<*>,
  clearStore$: Subject<*>,
  toggleCancelDialog$: Subject<*>
};

export const reducer$ = (actions: Actions) => {
  return Observable.merge(
    actions.toggleCancelDialog$.map(() => state => ({
      ...state,
      showRestrictionCancelDialog: !state.showRestrictionCancelDialog
    })),
    actions.setLoading$.map(loading => state => ({ ...state, ...loading })),
    actions.clearStore$.map(() => () => initialState),
    Observable.merge(
      actions.getAnalysis$,
      actions.updateAnalysis$
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
    actions.getAnalysisTypes$.map(analysisTypes => state => ({
      ...state,
      analysisTypes,
      analysisTypeCategories: uniq(analysisTypes.map(a => a.category))
    })),
    actions.loadPredefinedTypes$.map(predefinedTypes => state => ({
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
    actions.updateExtraResultAttribute$.map(({ name, value }) => state => ({
      ...state,
      extraResultAttributes: { ...state.extraResultAttributes, [name]: value }
    }))
  );
};

export const store$ = (
  actions$: Actions = {
    setLoading$,
    getAnalysisTypes$,
    getAnalysis$,
    updateAnalysis$,
    updateRestriction$,
    loadPredefinedTypes$,
    updateExtraDescriptionAttribute$,
    updateExtraResultAttribute$,
    clearStore$,
    toggleCancelDialog$
  }
) => createStore('analysisStore', reducer$(actions$), Observable.of(initialState));

const storeSingleton = store$();
export default storeSingleton;

type SampleTypes = {
  [string]: Array<SampleType>
};

export function getAnalysisDetails(
  ajaxGet: AjaxGet,
  ajaxPost: AjaxPost,
  props: {
    id: number,
    museumId: number,
    collectionId: string,
    token: string,
    callback?: Callback,
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
        if (!analysis.objectId) {
          return Observable.of(analysis);
        }
        return MusitObject.getObjectDetails(ajaxGet)({
          id: (analysis.objectId: any),
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

function getEventObjectDetails(props: AjaxParams, ajaxGet: AjaxGet) {
  return (event: { affectedThing: string }) => {
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
              ...sample,
              ...sampleObjectRes.response,
              sampleTypeObj: sampleType
            };
          });
        });
      }
      return Observable.of(objRes.response);
    });
  };
}

export function zipObjectInfoWithEvents(analysis: AnalysisCollection) {
  return (arrayOfObjectDetails: Array<{ objectId?: string, uuid?: string }>) => {
    const actualValues = arrayOfObjectDetails.filter(a => a);
    if (actualValues.length === 0) {
      return analysis;
    }
    const events = analysis.events
      ? analysis.events.map(e => {
          const od = arrayOfObjectDetails.find(objD => {
            return objD.objectId === e.affectedThing || objD.uuid === e.affectedThing;
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
      id: analysis.restriction && analysis.restriction.cancelledStamp
        ? analysis.restriction.cancelledStamp.user || ''
        : '',
      fieldName: 'restriction_cancelledByName'
    }
  ]);
}
