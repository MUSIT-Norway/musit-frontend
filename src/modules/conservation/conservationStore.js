// @ flow
import { simpleGet, simplePost, simplePut, simpleDel } from '../../shared/RxAjax';
import { Observable, Subject } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import type { Reducer } from 'react-rxjs/dist/RxStore';
import MusitConservation from '../../models/conservation';
import MusitActor from '../../models/actor';
import MusitObject from '../../models/object';
import flatten from 'lodash/flatten';
import type { Callback, AjaxGet, AjaxPost, AjaxPut, AjaxDel } from '../../types/ajax';
import type { AppSession } from '../../types/appSession';
import type {
  ConservationStoreState,
  ConservationCollection,
  ObjectInfo,
  ConservationSave
} from '../../types/conservation';
import type { Actor } from '../../types/actor';
import Sample from '../../models/sample';
import type { SampleType } from 'types/sample';
import { KEEP_ALIVE } from '../../stores/constants';
import find from 'lodash/find';
import { uploadFile, getFiles } from '../../models/conservation/documents';
import { sortBy } from 'lodash';

export const initialState: ConservationStoreState = {
  loadingConservation: false,
  conservation: null
};

type Flag = { ['loadingConservation']: boolean };

const setLoading$: Subject<Flag> = createAction('setLoading$');

const flagLoading = s => () => setLoading$.next(s);

export const getConservation$: Subject<*> = createAction('getConservation$');
const getConservationAction$: Observable<*> = getConservation$
  .do(flagLoading({ loadingConservation: true }))
  .switchMap(props =>
    MusitConservation.getConservationById(simpleGet)(props).flatMap(
      getConservationDetails(simpleGet, simplePost, props)
    )
  )
  .do(
    flagLoading({
      loadingConservation: false
    })
  );

export type SaveProps = {
  id: ?number,
  appSession: AppSession,
  data: ConservationSave,
  callback: Callback<*>
};
export const saveConservation$: Subject<SaveProps> = createAction('saveConservation$');
const saveConservationAction = (post, put) => props => {
  return Observable.of(props)
    .do(flagLoading({ loadingConservation: true }))
    .flatMap(saveConservation(post, put))
    .do(flagLoading({ loadingConservation: false }));
};

export const uploadFile$: Subject<*> = createAction('uploadFile$');
//const uploadFileAction = props => {
const uploadFileAction = (post, put) => props => {
  return Observable.of(props)
    .do(flagLoading({ loadingConservation: true }))
    .flatMap(uploadDocumentAndSaveConservation(post, put))
    .do(flagLoading({ loadingConservation: false }));
};

export const updateConservation$: Subject<*> = createAction('updateConservation$');
const updateConservationAction$: Observable<*> = updateConservation$
  .do(flagLoading({ loadingConservation: true }))
  .switchMap(MusitConservation.editConservationEvent(simplePut))
  .do(flagLoading({ loadingConservation: false }));

export const deleteConservation$: Subject<*> = createAction('deleteConservation$');
const deleteConservationAction$: Observable<*> = deleteConservation$.switchMap(
  MusitConservation.deleteConservationEvent(simpleDel)
);

export const clearStore$: Subject<*> = createAction('clearStore$');

type Actions = {
  saveConservation$: Subject<*>,
  uploadFile$: Subject<*>,
  setLoading$: Subject<Flag>,
  getConservationAction$: Observable<*>,
  updateConservationAction$: Observable<*>,
  clearStore$: Subject<*>,
  deleteConservationAction$: Subject<*>
};

const sortSubEvents = data => {
  if (data && data.events && data.events.length > 1) {
    const sortedEvents = sortBy(data.events, o => o.id);
    return { ...data, events: sortedEvents };
  } else {
    return data;
  }
};

export const reducer$ = (
  actions: Actions,
  ajaxGet: AjaxGet<*>,
  ajaxPost: AjaxPost<*>,
  ajaxPut: AjaxPut<*>,
  ajaxDel: AjaxDel<*>
): Observable<Reducer<ConservationStoreState>> => {
  return Observable.merge(
    actions.deleteConservationAction$.map(() => state => ({ ...state })),
    actions.saveConservation$
      .switchMap(saveConservationAction(ajaxPost, ajaxPut))
      .map(saveResult => state => ({ ...state, saveResult })),
    actions.uploadFile$
      .switchMap(uploadFileAction(ajaxPost, ajaxPut))
      .map(saveResult => state => ({ ...state, saveResult })),
    actions.setLoading$.map(loading => state => ({ ...state, ...loading })),
    actions.clearStore$.map(() => () => initialState),
    Observable.merge(
      actions.getConservationAction$,
      actions.updateConservationAction$
    ).map(conservation => state => ({
      ...state,
      conservation: sortSubEvents(conservation)
    }))
  );
};

export const store$ = (
  actions$: Actions = {
    saveConservation$,
    uploadFile$,
    setLoading$,
    getConservationAction$,
    updateConservationAction$,
    clearStore$,
    deleteConservationAction$
  },
  ajaxGet?: AjaxGet<*> = simpleGet,
  ajaxPost?: AjaxPost<*> = simplePost,
  ajaxPut?: AjaxPost<*> = simplePut,
  ajaxDel?: AjaxDel<*> = simpleDel
) =>
  createStore(
    'conservationStore',
    reducer$(actions$, ajaxGet, ajaxPost, ajaxPut, simpleDel),
    initialState,
    KEEP_ALIVE
  );

const storeSingleton = store$();
export default storeSingleton;

type SampleTypes = {
  [string]: Array<SampleType>
};

export function getConservationDetails(
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
): (conservation: ConservationCollection) => Observable<*> {
  return (conservation: ConservationCollection) =>
    MusitActor.getActors(ajaxPost)({
      actorIds: [conservation.registeredBy || '', conservation.updatedBy || '']
        .concat(
          (conservation.actorsAndRoles ? conservation.actorsAndRoles : []).map(
            a => a.actorId
          )
        )
        .concat(
          flatten(
            conservation.events &&
              conservation.events.map(
                e => e.actorsAndRoles && e.actorsAndRoles.map(a => a.actorId)
              )
          )
        )
        .filter(p => p),
      token: props.token
    })
      .map(actors => {
        if (actors) {
          const actorNames = getActorNames(actors, conservation);
          const actorsAndRoles = getActorNamesAndRoles(actors, conservation);
          const events = (conservation.events || []).map(e => {
            const actorsAndRoles = getActorNamesAndRoles(actors, e);
            const actorNames = getActorNames(actors, e);
            return { ...e, ...actorNames, actorsAndRoles };
          });
          return {
            ...conservation,
            ...actorNames,
            events,
            actorsAndRoles
          };
        }
        return conservation;
      })
      .flatMap(conservation => {
        return conservation && conservation.events && conservation.events.length > 0
          ? Observable.forkJoin(
              conservation.events.map(e => {
                //const attachments = ["2edbb781-0459-4281-ab0e-84e5b3bd4521", "60abc85c-938b-4af3-bbe0-d2532148a707"];
                //const attachments = [];
                const attachments = e.documents || [];
                if (attachments.length > 0) {
                  return getFiles({
                    files: attachments,
                    museumId: props.museumId,
                    token: props.token,
                    eventId: e.id //211
                  }).map(files => {
                    const events = { ...e, files: files };
                    return {
                      ...events
                    };
                  });
                }
                return Observable.of(e);
              })
            ).map(events => {
              const output = { ...conservation, events };
              return output;
            })
          : Observable.of(conservation);
      })
      .flatMap(conservation => {
        const affectedThings = conservation.affectedThings;
        if (affectedThings && affectedThings.length > 0) {
          return Observable.forkJoin(
            affectedThings.map(getEventObjectDetails(props, ajaxGet))
          ).map(zipObjectInfoWithEvents(conservation));
        }
        return Observable.of(conservation);
      });
}

type AjaxParams = {
  museumId: number,
  collectionId: string,
  token: string,
  sampleTypes: SampleTypes
};

export function getEventObjectDetails(
  props: AjaxParams,
  ajaxGet: AjaxGet<*>
): (t: any) => Observable<ObjectInfo> {
  return uuid => {
    const params = {
      id: uuid,
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
              objectData: sampleObjectRes.response,
              ...sampleObjectRes.response
            };
          });
        });
      }
      return Observable.of({ objectData: objRes.response, ...objRes.response });
    });
  };
}

export function zipObjectInfoWithEvents(conservation: ConservationCollection) {
  return (arrayOfObjectDetails: Array<ObjectInfo>): ConservationCollection => {
    const actualValues = arrayOfObjectDetails.filter(a => a);
    if (actualValues.length === 0) {
      return conservation;
    }
    const events = conservation.events
      ? conservation.events.map(e => {
          const od = arrayOfObjectDetails.find(objD => {
            return (
              (objD.sampleData && objD.sampleData.objectId === e) ||
              (objD.objectData && objD.objectData.uuid === e)
            );
          });
          return od ? { ...od, ...e } : e;
        })
      : [];
    return {
      ...conservation,
      events: events,
      affectedThings: arrayOfObjectDetails
    };
  };
}

export function getActorNames(
  actors: Array<Actor>,
  conservation: ConservationCollection
) {
  return MusitActor.getMultipleActorNames(actors, [
    {
      id: conservation.updatedBy || '',
      fieldName: 'updatedByName'
    },
    {
      id: conservation.registeredBy || '',
      fieldName: 'registeredByName'
    }
  ]);
}

export function getActorNamesAndRoles(
  actors: Array<Actor>,
  conservation: ConservationCollection
) {
  if (conservation.actorsAndRoles) {
    return conservation.actorsAndRoles.map(ard => {
      const a = find(actors, a => MusitActor.hasActorId(a, ard.actorId));
      return {
        actorId: ard.actorId,
        roleId: ard.roleId,
        date: ard.date,
        actorName: a.fn
      };
    });
  }
  return [];
}

const saveConservation = (ajaxPost, ajaxPut) => ({
  id,
  result,
  appSession,
  data,
  callback
}) => {
  const token = appSession.accessToken;
  const museumId = appSession.museumId;
  return getConservationUpsert(
    id,
    ajaxPut,
    museumId,
    data,
    token,
    ajaxPost,
    callback
  ).map((conservation?: ConservationCollection) => {
    if (!conservation) {
      return Observable.empty();
    }
    return Observable.of(conservation);
  });
};

function getConservationUpsert(id, ajaxPut, museumId, data, token, ajaxPost, callback) {
  return id
    ? MusitConservation.editConservationEvent(ajaxPut)({
        id,
        museumId,
        data,
        token,
        callback
      })
    : MusitConservation.saveConservationEvent(ajaxPost)({
        museumId,
        data,
        token,
        callback
      });
}

const uploadDocumentAndSaveConservation = (ajaxPost, ajaxPut) => ({
  eventId,
  parentEventId,
  museumId,
  collectionId,
  token,
  files,
  data,
  callback
}) => {
  if (!eventId) {
    return Observable.empty();
  }

  const files$ =
    files.length > 0
      ? Observable.forkJoin(
          files.map(file =>
            uploadFile({
              eventId: eventId,
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
    const findEvent = data && data.events && data.events.find(f => f.id === eventId);
    const existingFids = findEvent ? findEvent.documents : [];
    const fids = existingFids.concat(newFids);

    const updatedEvent = { ...findEvent, documents: fids };
    const remaingEvents =
      data && data.events && data.events.filter(f => f.id !== eventId);
    const newEvents = remaingEvents.concat(updatedEvent);
    const updatedData = { ...data, events: newEvents };

    return getConservationUpsert(
      parentEventId,
      ajaxPut,
      museumId,
      updatedData,
      token,
      ajaxPost,
      callback
    )
      .map((conservation?: ConservationCollection) => {
        if (!conservation) {
          return Observable.empty();
        }
        return Observable.of(conservation);
      })
      .do(results => {
        if (callback && callback.onComplete) {
          callback.onComplete({
            id: eventId,
            results: results.results,
            badFiles
          });
        }
      });
  });
};
