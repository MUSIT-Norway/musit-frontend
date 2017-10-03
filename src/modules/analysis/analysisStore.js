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
import type { Callback, AjaxGet, AjaxPost, AjaxPut } from '../../types/ajax';
import type {
  AnalysisCollection,
  AnalysisType,
  ObjectInfo,
  AffectedThing,
  Result
} from '../../types/analysis';
import type {
  Purposes,
  Categories,
  AnalysisLabList,
  SampleTypes
} from '../../types/predefined';
import type { Actor } from '../../types/actor';
import type { SampleData } from '../../types/samples';
import type { ObjectData } from '../../types/object';
import type { AnalysisSavePayload } from '../../models/analysis/analysis';
import type { AppSession } from '../../types/appSession';
import { emitError, emitSuccess } from '../../shared/errors';
import { I18n } from 'react-i18nify';
import { addResultFile, getFiles } from '../../models/analysis/analysisResult';
import type { ErrorLoading, SavedFile } from '../../models/analysis/analysisResult';
import { KEEP_ALIVE } from '../../stores/constants';
import { parseValue } from './shared/getters';

export type CommonParams = {
  id: number,
  museumId: number,
  collectionId: string,
  token: string,
  callback?: Callback<*>
};

export type AnalysisStoreState = {
  analysisTypes?: Array<AnalysisType>,
  loading?: boolean,
  savingAnalysis?: boolean,
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
const getAnalysisTypesAction = get => props => {
  return Observable.of(props).flatMap(MusitAnalysis.getAnalysisTypesForCollection(get));
};

export type GetAnalysisProps = CommonParams & { sampleTypes: SampleTypes };
export const getAnalysis$: Subject<GetAnalysisProps> = createAction('getAnalysis$');
const getAnalysisAction = (get, post) => props =>
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
  id: ?number,
  result: ?Result,
  appSession: AppSession,
  data: AnalysisSavePayload,
  events: Array<
    ObjectData &
      SampleData & {
        result?: ?{
          [string]: any,
          files?: ?Array<File> | ?Array<SavedFile | ErrorLoading>
        }
      }
  >,
  callback: Callback<*>
};
export const saveAnalysis$: Subject<SaveProps> = createAction('saveAnalysis$');
const saveAnalysisAction = (post, put) => props => {
  return Observable.of(props)
    .do(flagLoading({ loadingAnalysis: true }))
    .flatMap(saveAnalysis(post, put))
    .do(flagLoading({ loadingAnalysis: false }));
};

export const updateAnalysis$: Subject<*> = createAction('updateAnalysis$');
const updateAnalysisAction = put => props => {
  return Observable.of(props)
    .do(flagLoading({ loadingAnalysis: true }))
    .flatMap(MusitAnalysis.editAnalysisEvent(put))
    .do(flagLoading({ loadingAnalysis: false }));
};

export const updateRestriction$: Subject<*> = createAction('updateRestriction$');
export const updateExtraDescriptionAttribute$: Subject<*> = createAction(
  'updateExtraDescriptionAttribute$'
);
export const clearStore$: Subject<*> = createAction('clearStore$');
export const updateExtraResultAttribute$: Subject<*> = createAction(
  'updateExtraResultAttribute$'
);

export const loadPredefinedTypes$ = createAction('loadPredefinedTypes$');
const loadPredefinedTypesAction = get => props => {
  return Observable.of(props).flatMap(props =>
    MusitAnalysis.loadPredefinedTypes(get)(props)
  );
};

type Actions = {
  saveAnalysis$: Subject<*>,
  setLoading$: Subject<Flag>,
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

const updateResultAttribute = ({ name, value }) => state => {
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
  ajaxGet: AjaxGet<*>,
  ajaxPost: AjaxPost<*>,
  ajaxPut: AjaxPut<*>
): Observable<Reducer<AnalysisStoreState>> => {
  return Observable.merge(
    actions.saveAnalysis$
      .switchMap(saveAnalysisAction(ajaxPost, ajaxPut))
      .map(saveResult => state => ({ ...state, saveResult })),
    actions.toggleCancelDialog$.map(() => state => ({
      ...state,
      showRestrictionCancelDialog: !state.showRestrictionCancelDialog
    })),
    actions.setLoading$.map(loading => state => ({ ...state, ...loading })),
    actions.clearStore$.map(() => () => initialState),
    actions.getAnalysis$
      .switchMap(getAnalysisAction(ajaxGet, ajaxPost))
      .map(analysis => state => ({
        ...state,
        analysis
      })),
    actions.updateAnalysis$
      .switchMap(updateAnalysisAction(ajaxPut))
      .map(analysis => state => ({
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
    actions.getAnalysisTypes$
      .switchMap(getAnalysisTypesAction(ajaxGet))
      .map(analysisTypes => state => ({
        ...state,
        analysisTypes,
        analysisTypeCategories: analysisTypes && uniq(analysisTypes.map(a => a.category))
      })),
    actions.loadPredefinedTypes$
      .switchMap(loadPredefinedTypesAction(ajaxGet))
      .map(predefinedTypes => state => ({
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
  ajaxGet?: AjaxGet<*> = simpleGet,
  ajaxPost?: AjaxPost<*> = simplePost,
  ajaxPut?: AjaxPost<*> = simplePut
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

const saveAnalysis = (ajaxPost, ajaxPut) => ({
  id,
  result,
  appSession,
  data,
  events,
  callback
}) => {
  const token = appSession.accessToken;
  const museumId = appSession.museumId;
  const collectionId = appSession.collectionId;
  return getAnalysisUpsert(
    id,
    ajaxPut,
    museumId,
    data,
    token,
    ajaxPost
  ).flatMap((analysis?: AnalysisCollection) => {
    if (!analysis) {
      return Observable.empty();
    }

    const analysisId = analysis.id;
    const analysisEvents = analysis.events;

    const eventsResultUploads$ =
      events && events.length > 0
        ? Observable.forkJoin(
            // $FlowFixMe | We are passing an array to forkJoin which is not supported by flow-typed definition for rxjs.
            events.map(ae => {
              const files = (ae.result && ae.result.files) || [];
              if (files.length === 0) {
                return Observable.of(ae);
              }
              return Observable.forkJoin(
                // $FlowFixMe | We are passing an array to forkJoin which is not supported by flow-typed definition for rxjs.
                files.map(file =>
                  addResultFile({
                    analysisId: ae.id,
                    museumId: museumId,
                    collectionId: collectionId,
                    token: token,
                    file: file
                  })
                )
              ).map(files => {
                return {
                  ...ae,
                  result: {
                    ...ae.result,
                    files,
                    attachments: files
                      ? files
                          .map(e => e.fid)
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
            files.map(file =>
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

    return files$.flatMap(files => {
      const newFids = files.reduce((acc, f) => {
        if (f.fid) {
          return [...acc, f.fid];
        }
        return acc;
      }, []);
      const badFiles = files.filter(f => !f.fid);
      const existingFids = result && result.attachments ? result.attachments : [];
      return eventsResultUploads$.flatMap(updatedEvents => {
        return Observable.forkJoin(
          // $FlowFixMe | We are passing an array to forkJoin which is not supported by flow-typed definition for rxjs.
          getArrayOfResultsToSave(
            updatedEvents,
            analysisId,
            analysisEvents,
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
              callback.onComplete({ id: analysisId, results: results.results, badFiles });
            }
          });
      });
    });
  });
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
  return (_analysis: ?AnalysisCollection) => {
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
                  event.result.attachments.length > 0
                    ? getFiles({
                        files: event.result.attachments,
                        museumId: props.museumId,
                        token: props.token,
                        analysisId: event.id
                      }).map(files => {
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

function getAnalysisUpsert(id, ajaxPut, museumId, data, token, ajaxPost) {
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

function zipEventsWithId(formEvents, apiEvents) {
  return formEvents.map(evt => {
    const eventObjectId = evt.objectId || evt.uuid;
    const event =
      apiEvents &&
      apiEvents.find(evtFromServer => evtFromServer.affectedThing === eventObjectId);
    return { ...evt, id: event ? event.id : evt.id };
  });
}

function getArrayOfResultsToSave(
  events,
  analysisId,
  analysisEvents,
  ajaxPost,
  token,
  museumId,
  result
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
        .map(res => ({ analysisId: res.response, error: (res: any).error }))
        .catch(error => Observable.of({ error }))
    )
    .concat(
      MusitAnalysis.addResult(ajaxPost)({
        token,
        museumId,
        result,
        analysisId: parseInt(analysisId, 10)
      })
        .map(res => ({ analysisId: res.response, error: (res: any).error }))
        .catch(error => Observable.of({ error }))
    );
}
