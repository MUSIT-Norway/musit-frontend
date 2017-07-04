// @flow
import { simpleGet, simplePost } from '../../shared/RxAjax';
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

export const getAnalysisTypes$ = createAction('getAnalysisTypes$').switchMap(
  MusitAnalysis.getAnalysisTypesForCollection()
);

export const setLoading$ = createAction('setLoading$');
export const getAnalysis$ = createAction('getAnalysis$').switchMap(props =>
  MusitAnalysis.getAnalysisById(simpleGet)(props).flatMap(
    getAnalysisDetails(simpleGet, simplePost, props)
  )
);

export const updateExtraDescriptionAttribute$ = createAction(
  'updateExtraDescriptionAttribute$'
);

export const clearStore$ = createAction('clearStore$');

export const updateExtraResultAttribute$ = createAction('updateExtraResultAttribute$');

export const loadPredefinedTypes$ = createAction(
  'loadPredefinedTypes$'
).switchMap(props => MusitAnalysis.loadPredefinedTypes()(props));

type Actions = {
  setLoading$: Subject,
  getAnalysis$: Subject,
  getAnalysisTypes$: Subject,
  loadPredefinedTypes$: Subject,
  updateExtraDescriptionAttribute$: Subject,
  updateExtraResultAttribute$: Subject,
  clearStore$: Subject
};

export const reducer$ = (actions: Actions) =>
  Observable.merge(
    actions.clearStore$.map(() => () => initialState),
    actions.setLoading$.map(() => state => ({ ...state, loading: true })),
    actions.getAnalysis$.map(analysis => state => ({
      ...state,
      analysis,
      loading: false
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

export const store$ = (
  actions$: Actions = {
    getAnalysisTypes$,
    setLoading$,
    getAnalysis$,
    loadPredefinedTypes$,
    updateExtraDescriptionAttribute$,
    updateExtraResultAttribute$,
    clearStore$
  }
) => createStore('analysisStore', reducer$(actions$), Observable.of(initialState));

const storeSingleton = store$();
export default storeSingleton;

type SampleTypes = {
  [string]: Array<{ sampleTypeId: number, enSampleType: string, enSampleSubType: string }>
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
): (analysis: AnalysisCollection) => Observable {
  return (analysis: AnalysisCollection) =>
    MusitActor.getActors(ajaxPost)({
      actorIds: [
        analysis.registeredBy || '',
        analysis.updatedBy || '',
        analysis.doneBy || '',
        analysis.responsible || '',
        analysis.administrator || '',
        analysis.completedBy || '',
        analysis.restriction ? analysis.restriction.requester || '' : ''
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
        if (analysis.type === 'AnalysisCollection' && analysis.events.length > 0) {
          return Observable.forkJoin(
            analysis.events.map(getEventObjectDetails(props, ajaxGet))
          ).map(zipObjectInfoWithEvents(analysis));
        }
        if (!analysis.objectId) {
          return Observable.of(analysis);
        }
        return MusitObject.getObjectDetails(ajaxGet)({
          id: analysis.objectId,
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
  return (event: { objectId: string }) => {
    const params = {
      id: event.objectId,
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
              sampleType: sampleType.enSampleType,
              sampleSubType: sampleType.enSampleSubType
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
            return objD.objectId === e.objectId || objD.uuid === e.objectId;
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
    }
  ]);
}
