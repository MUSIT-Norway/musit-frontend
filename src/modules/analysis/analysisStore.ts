// @flow
import { simpleGet, simplePost, simplePut } from '../../shared/RxAjax';
import { Observable, Subject } from 'rxjs';
import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import { Reducer } from 'react-rxjs';
import MusitAnalysis from '../../models/analysis';
import MusitActor from '../../models/actor';
import MusitObject from '../../models/object';
import Sample from '../../models/sample';
import { flatten, uniq } from 'lodash';

import { Callback, AjaxGet, AjaxPost, AjaxPut } from '../../types/ajax';
import {
  AnalysisCollection,
  AnalysisType,
  ObjectInfo,
  AffectedThing,
  Result,
  AnalysisEvent
} from '../../types/analysis';
import {
  Purposes,
  Categories,
  AnalysisLabList,
  SampleTypes
} from '../../types/predefined';
import { Actor } from '../../types/actor';
import { SampleData } from '../../types/samples';
import { ObjectData } from '../../types/object';
import { AnalysisSavePayload } from '../../models/analysis/analysis';
import { AppSession } from '../../types/appSession';
import { emitError, emitSuccess } from '../../shared/errors';
import { I18n } from 'react-i18nify';
import { addResultFile, getFiles } from '../../models/analysis/analysisResult';
import { ErrorLoading, SavedFile } from '../../models/analysis/analysisResult';
import { KEEP_ALIVE } from '../../stores/constants';
import { parseValue } from './shared/getters';
import { Maybe, Star, TODO, MUSTFIX } from '../../types/common';

export type CommonParams = {
  id: number;
  museumId: number;
  collectionId: string;
  token: string;
  callback?: Callback<Star>;
};

export type AnalysisStoreState = {
  analysisTypes?: Array<AnalysisType>;
  loading?: boolean;
  savingAnalysis?: boolean;
  purposes?: Purposes;
  categories?: Categories;
  analysisLabList?: AnalysisLabList;
  analysisTypeCategories?: Array<string>;
  extraDescriptionAttributes?: any;
  extraResultAttributes?: any;
  analysis?: Maybe<AnalysisCollection>;
  showRestrictionCancelDialog?: Maybe<boolean>;
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

export const toggleCancelDialog$: Subject<Star> = createAction('toggleCancelDialog$');

type Flag = { ['loadingAnalysis']: boolean };

const setLoading$: Subject<Flag> = createAction('setLoading$');

const flagLoading = (s: TODO) => () => setLoading$.next(s);

export const getAnalysisTypes$: Subject<Star> = createAction('getAnalysisTypes$');
const getAnalysisTypesAction = (get: TODO) => (props: TODO) => {
  return Observable.of(props).flatMap(MusitAnalysis.getAnalysisTypesForCollection(get));
};

export type GetAnalysisProps = CommonParams & { sampleTypes: SampleTypes };
export const getAnalysis$: Subject<GetAnalysisProps> = createAction('getAnalysis$');
const getAnalysisAction = (get: TODO, post: TODO) => (props: GetAnalysisProps) =>
  Observable.of(props)
    .do(flagLoading({ loadingAnalysis: true }))
    .flatMap(props =>
      MusitAnalysis.getAnalysisById(get)({
        id: props.id,
        museumId: props.museumId,
        token: props.token
      }).flatMap(getAnalysisDetails(get, post, props))
    )
    .do(flagLoading({ loadingAnalysis: false }));

export type SaveProps = {
  id: Maybe<number>;
  result: Maybe<Result>;
  appSession: AppSession;
  data: AnalysisSavePayload;
  events: Array<
    ObjectData &
      SampleData & {
        result?: Maybe<{
          [key: string]: any;
          files?: Maybe<Array<File>> | Maybe<Array<SavedFile | ErrorLoading>>;
        }>;
      }
  >;
  callback: Callback<Star>;
  ajaxPost: MUSTFIX; //I needed to add these to get another file to compile
  ajaxPut: MUSTFIX; //I needed to add these to get another file to compile
};
export const saveAnalysis$: Subject<SaveProps> = createAction('saveAnalysis$');
const saveAnalysisAction = (post: TODO, put: TODO) => (props: SaveProps) => {
  return Observable.of(props)
    .do(flagLoading({ loadingAnalysis: true }))
    .flatMap(saveAnalysis(post, put))
    .do(flagLoading({ loadingAnalysis: false }));
};

export const updateAnalysis$: Subject<Star> = createAction('updateAnalysis$');
const updateAnalysisAction = (put: TODO) => (props: TODO) => {
  return Observable.of(props)
    .do(flagLoading({ loadingAnalysis: true }))
    .flatMap(MusitAnalysis.editAnalysisEvent(put))
    .do(flagLoading({ loadingAnalysis: false }));
};

export const updateRestriction$: Subject<Star> = createAction('updateRestriction$');
export const updateExtraDescriptionAttribute$: Subject<Star> = createAction(
  'updateExtraDescriptionAttribute$'
);
export const clearStore$: Subject<Star> = createAction('clearStore$');
export const updateExtraResultAttribute$: Subject<Star> = createAction(
  'updateExtraResultAttribute$'
);

export const loadPredefinedTypes$ = createAction('loadPredefinedTypes$');
const loadPredefinedTypesAction = (get: TODO) => (props: TODO) => {
  return Observable.of(props).flatMap(props =>
    MusitAnalysis.loadPredefinedTypes(get)(props)
  );
};

type Actions = {
  saveAnalysis$: Subject<Star>;
  setLoading$: Subject<Flag>;
  getAnalysis$: Subject<Star>;
  updateAnalysis$: Subject<Star>;
  updateRestriction$: Subject<Star>;
  getAnalysisTypes$: Subject<Star>;
  loadPredefinedTypes$: Subject<Star>;
  updateExtraDescriptionAttribute$: Subject<Star>;
  updateExtraResultAttribute$: Subject<Star>;
  clearStore$: Subject<Star>;
  toggleCancelDialog$: Subject<Star>;
};

const updateResultAttribute = ({ name, value }: TODO) => (state: TODO) => {
  return {
    ...state,
    extraResultAttributes: {
      ...state.extraResultAttributes,
      [name]: parseValue(value)
    }
  };
};

export const reducer$ = (
  actions: Actions,
  ajaxGet: AjaxGet<Star>,
  ajaxPost: AjaxPost<Star>,
  ajaxPut: AjaxPut<Star>
): Observable<Reducer<AnalysisStoreState>> => {
  return Observable.merge(
    actions.saveAnalysis$
      .switchMap(saveAnalysisAction(ajaxPost, ajaxPut))
      .map(saveResult => (state: TODO) => ({ ...state, saveResult })),
    actions.toggleCancelDialog$.map(() => (state: TODO) => ({
      ...state,
      showRestrictionCancelDialog: !state.showRestrictionCancelDialog
    })),
    actions.setLoading$.map(loading => (state: TODO) => ({ ...state, ...loading })),
    actions.clearStore$.map(() => () => initialState),
    actions.getAnalysis$
      .switchMap(getAnalysisAction(ajaxGet, ajaxPost))
      .map(analysis => (state: TODO) => ({
        ...state,
        analysis
      })),
    actions.updateAnalysis$
      .switchMap(updateAnalysisAction(ajaxPut))
      .map(analysis => (state: TODO) => ({
        ...state,
        analysis
      })),
    actions.updateRestriction$.map(restriction => (state: TODO) => ({
      ...state,
      analysis: {
        ...state.analysis,
        restriction
      }
    })),
    actions.getAnalysisTypes$
      .switchMap(getAnalysisTypesAction(ajaxGet))
      .map(analysisTypes => (state: TODO) => ({
        ...state,
        analysisTypes,
        analysisTypeCategories: analysisTypes && uniq(analysisTypes.map(a => a.category))
      })),
    actions.loadPredefinedTypes$
      .switchMap(loadPredefinedTypesAction(ajaxGet))
      .map(predefinedTypes => (state: TODO) => ({
        ...state,
        categories: predefinedTypes.categories,
        purposes: predefinedTypes.purposes,
        analysisTypes: predefinedTypes.analysisTypes,
        analysisLabList: predefinedTypes.analysisLabList
      })),
    actions.updateExtraDescriptionAttribute$.map(({ name, value }) => (state: TODO) => ({
      ...state,
      extraDescriptionAttributes: { ...state.extraDescriptionAttributes, [name]: value }
    })),
    actions.updateExtraResultAttribute$.map(updateResultAttribute)
  );
};

export const store$ = (
  actions$: Actions = {
    setLoading$,
    saveAnalysis$,
    getAnalysisTypes$,
    getAnalysis$,
    updateAnalysis$,
    updateRestriction$,
    loadPredefinedTypes$,
    updateExtraDescriptionAttribute$,
    updateExtraResultAttribute$,
    clearStore$,
    toggleCancelDialog$
  },
  ajaxGet: AjaxGet<Star> = simpleGet,
  ajaxPost: AjaxPost<Star> = simplePost,
  ajaxPut: AjaxPost<Star> = simplePut
) => {
  return createStore(
    'analysisStore',
    reducer$(actions$, ajaxGet, ajaxPost, ajaxPut),
    initialState,
    KEEP_ALIVE
  );
};

const storeSingleton = store$();
export default storeSingleton;

const saveAnalysis = (ajaxPost: AjaxPost<TODO>, ajaxPut: AjaxPut<TODO>) => ({
  id,
  result,
  appSession,
  data,
  events,
  callback
}: TODO) => {
  const token = appSession.accessToken;
  const museumId = appSession.museumId;
  const collectionId = appSession.collectionId;
  return getAnalysisUpsert(id, ajaxPut, museumId, data, token, ajaxPost).flatMap(
    (analysis?: AnalysisCollection) => {
      if (!analysis) {
        return Observable.empty();
      }

      const analysisId = analysis.id;
      const analysisEvents = analysis.events;

      const eventsResultUploads$ =
        events && events.length > 0
          ? Observable.forkJoin(
              // $FlowFixMe | We are passing an array to forkJoin which is not supported by flow-typed definition for rxjs.
              events.map((ae: TODO) => {
                const files = (ae.result && ae.result.files) || [];
                if (files.length === 0) {
                  return Observable.of(ae);
                }
                return Observable.forkJoin(
                  // $FlowFixMe | We are passing an array to forkJoin which is not supported by flow-typed definition for rxjs.
                  files.map((file: File) =>
                    addResultFile({
                      analysisId: ae.id,
                      museumId: museumId,
                      collectionId: collectionId,
                      token: token,
                      file: file
                    })
                  )
                ).map((files: File[]) => {
                  return {
                    ...ae,
                    result: {
                      ...ae.result,
                      files,
                      attachments: files
                        ? files
                            .map(e => (e as MUSTFIX).fid)
                            .concat((ae.result && ae.result.attachments) || [])
                        : []
                    }
                  };
                });
              })
            )
          : Observable.of([]);

      const files = result ? result.files || [] : [];
      const files$ =
        files.length > 0
          ? Observable.forkJoin(
              // $FlowFixMe | We are passing an array to forkJoin which is not supported by flow-typed definition for rxjs.
              files.map((file: File) =>
                addResultFile({
                  analysisId: analysisId,
                  museumId: museumId,
                  collectionId: collectionId,
                  token: token,
                  file: file
                })
              )
            )
          : Observable.of([]);

      return files$.flatMap((files: File[]) => {
        const newFids = files.reduce((acc, f) => {
          if ((f as MUSTFIX).fid) {
            return [...acc, (f as MUSTFIX).fid];
          }
          return acc;
        }, []);
        const badFiles = files.filter(f => !(f as MUSTFIX).fid);
        const existingFids = result && result.attachments ? result.attachments : [];
        return eventsResultUploads$.flatMap(updatedEvents => {
          return Observable.forkJoin(
            // $FlowFixMe | We are passing an array to forkJoin which is not supported by flow-typed definition for rxjs.
            getArrayOfResultsToSave(
              updatedEvents,
              analysisId,
              analysisEvents as TODO,
              ajaxPost,
              token,
              museumId,
              { ...result, files: null, attachments: [...newFids, ...existingFids] }
            )
          )
            .map(results => ({
              analysis,
              files,
              events: updatedEvents,
              results
            }))
            .do(results => {
              if (callback && callback.onComplete) {
                callback.onComplete({
                  id: analysisId,
                  results: results.results,
                  badFiles
                });
              }
            });
        });
      });
    }
  );
};

export function getAnalysisDetails(
  ajaxGet: AjaxGet<Star>,
  ajaxPost: AjaxPost<Star>,
  props: {
    id: number;
    museumId: number;
    collectionId: string;
    token: string;
    callback?: Callback<Star>;
    sampleTypes: SampleTypes;
  }
): (analysis: AnalysisCollection) => Observable<Star> {
  return (_analysis: Maybe<AnalysisCollection>) => {
    if (!_analysis) {
      return Observable.of(_analysis);
    }
    const analysis = _analysis;
    return MusitActor.getActors(ajaxPost)({
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
        const attachments = (analysis.result && analysis.result.attachments) || [];
        if (attachments.length > 0) {
          return getFiles({
            files: attachments,
            museumId: props.museumId,
            token: props.token,
            analysisId: analysis.id
          }).map(files => {
            return {
              ...analysis,
              files
            };
          });
        }
        return Observable.of(analysis);
      })
      .flatMap(analysis => {
        if (analysis.type === 'AnalysisCollection') {
          const events = analysis.events;
          if (events && events.length > 0) {
            // $FlowFixMe | We are passing an array to forkJoin which is not supported by flow-typed definition for rxjs.
            return Observable.forkJoin(events.map(getEventObjectDetails(props, ajaxGet)))
              .map(zipObjectInfoWithEvents(analysis))
              .flatMap(analysis => {
                const fetchFileOperations = analysis.events.map(event => {
                  return event.result &&
                    event.result.attachments &&
                    (event.result.attachments as MUSTFIX).length > 0
                    ? getFiles({
                        files: event.result.attachments,
                        museumId: props.museumId,
                        token: props.token,
                        analysisId: event.id
                      } as TODO).map((files: TODO) => {
                        return {
                          ...event,
                          files
                        };
                      })
                    : Observable.of(event);
                });

                return fetchFileOperations.length > 0
                  ? Observable.forkJoin(fetchFileOperations).map(events => ({
                      ...analysis,
                      events: events
                    }))
                  : Observable.of(analysis);
              });
          }
        }
        return Observable.of(analysis);
      });
  };
}

type AjaxParams = {
  museumId: number;
  collectionId: string;
  token: string;
  sampleTypes: SampleTypes;
};

function getEventObjectDetails(
  props: AjaxParams,
  ajaxGet: AjaxGet<Star>
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
              (st: any) => st.sampleTypeId === sample.sampleTypeId
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
            return ((objD.sampleData && objD.sampleData.objectId === e.affectedThing) ||
              (objD.objectData && objD.objectData.uuid === e.affectedThing)) as TODO;
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

function getAnalysisUpsert(
  id: TODO,
  ajaxPut: AjaxPut<TODO>,
  museumId: TODO,
  data: TODO,
  token: TODO,
  ajaxPost: AjaxPost<TODO>
) {
  return id
    ? MusitAnalysis.editAnalysisEvent(ajaxPut)({
        id,
        museumId,
        data,
        token,
        callback: {
          onComplete: () => {
            emitSuccess({
              type: 'saveSuccess',
              message: I18n.t('musit.analysis.saveAnalysisSuccess')
            });
          },
          onFailure: e => {
            emitError({
              type: 'errorOnSave',
              error: e,
              message: I18n.t('musit.analysis.saveAnalysisError')
            });
          }
        }
      })
    : MusitAnalysis.saveAnalysisEvent(ajaxPost)({
        museumId,
        data,
        token,
        callback: {
          onComplete: () => {
            emitSuccess({
              type: 'saveSuccess',
              message: I18n.t('musit.analysis.saveAnalysisSuccess')
            });
          },
          onFailure: e => {
            emitError({
              type: 'errorOnSave',
              error: e,
              message: I18n.t('musit.analysis.saveAnalysisError')
            });
          }
        }
      });
}

function zipEventsWithId(formEvents: AnalysisEvent[], apiEvents: AnalysisEvent[]) {
  return formEvents.map((evt: TODO) => {
    const eventObjectId = evt.objectId || evt.uuid;
    const event =
      apiEvents &&
      apiEvents.find(evtFromServer => evtFromServer.affectedThing === eventObjectId);
    return { ...evt, id: event ? event.id : evt.id };
  });
}

function getArrayOfResultsToSave(
  events: TODO,
  analysisId: TODO,
  analysisEvents: AnalysisEvent[],
  ajaxPost: AjaxPost<TODO>,
  token: string,
  museumId: TODO,
  result: TODO
): Array<Observable<{ analysisId: number } | { error: any }>> {
  return zipEventsWithId(events, analysisEvents)
    .map(evt =>
      MusitAnalysis.addResult(ajaxPost)({
        token,
        museumId,
        result: {
          ...evt.result,
          attachments: evt.result ? evt.result.attachments : [],
          type: result && result.type
        },
        analysisId: parseInt(evt.id, 10)
      })
        .map(res => ({ analysisId: res.response, error: (res as any).error }))
        .catch(error => Observable.of({ error }))
    )
    .concat(
      MusitAnalysis.addResult(ajaxPost)({
        token,
        museumId,
        result,
        analysisId: parseInt(analysisId, 10)
      })
        .map(res => ({ analysisId: res.response, error: (res as any).error }))
        .catch(error => Observable.of({ error }))
    );
}
