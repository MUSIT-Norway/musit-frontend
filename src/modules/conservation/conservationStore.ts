// @ flow
import { simpleGet, simplePost, simplePut, simpleDel } from '../../shared/RxAjax';
import { Observable, Subject } from 'rxjs';
import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import { Reducer } from 'react-rxjs';
import MusitConservation from '../../models/conservation';
import MusitActor from '../../models/actor';
import MusitObject from '../../models/object';
import { flatten, find } from 'lodash';
import { Callback, AjaxGet, AjaxPost, AjaxPut, AjaxDel } from '../../types/ajax';
import { AppSession } from '../../types/appSession';
import {
  ConservationStoreState,
  ConservationCollection,
  ObjectInfo,
  ConservationSave
} from '../../types/conservation';
import { Actor } from '../../types/actor';
import Sample from '../../models/sample';
import { SampleType } from '../../types/sample';
import { KEEP_ALIVE } from '../../stores/constants';
import { uploadFile, getFiles } from '../../models/conservation/documents';
import { sortBy } from 'lodash';
import { Star, TODO, Maybe } from '../../types/common';

export const initialState: ConservationStoreState = {
  loadingConservation: false,
  conservation: null
};

type Flag = { ['loadingConservation']: boolean };

const setLoading$: Subject<Flag> = createAction('setLoading$');

const flagLoading = (s: TODO) => () => setLoading$.next(s);

export const getConservation$: Subject<Star> = createAction('getConservation$');
const getConservationAction$: Observable<Star> = getConservation$
  .do(flagLoading({ loadingConservation: true }))
  .do(r => console.log(r))
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
  id: Maybe<number>;
  appSession: AppSession;
  data: ConservationSave;
  callback: Callback<Star>;
  ajaxPost: TODO;
  ajaxPut: TODO;
  /*   ajaxPost: AjaxPost<TODO>;
  ajaxPut: AjaxPut<TODO>;
 */
};
export const saveConservation$: Subject<SaveProps> = createAction('saveConservation$');

const saveConservationAction = (post: AjaxPost<TODO>, put: AjaxPut<TODO>) => (
  props: TODO
) => {
  return Observable.of(props)
    .do(flagLoading({ loadingConservation: true }))
    .flatMap(saveConservation(post, put))
    .do(flagLoading({ loadingConservation: false }));
};

export const uploadFile$: Subject<Star> = createAction('uploadFile$');
//const uploadFileAction = props => {
const uploadFileAction = (post: TODO, put: TODO) => (props: TODO) => {
  return Observable.of(props)
    .do(flagLoading({ loadingConservation: true }))
    .flatMap(uploadDocumentAndSaveConservation(post, put))
    .do(flagLoading({ loadingConservation: false }));
};

export const updateConservation$: Subject<Star> = createAction('updateConservation$');
const updateConservationAction$: Observable<Star> = updateConservation$
  .do(flagLoading({ loadingConservation: true }))
  .switchMap(MusitConservation.editConservationEvent(simplePut))
  .do(flagLoading({ loadingConservation: false }));

export const deleteConservation$: Subject<Star> = createAction('deleteConservation$');
const deleteConservationAction$: Observable<Star> = deleteConservation$.switchMap(
  MusitConservation.deleteConservationEvent(simpleDel)
);

export const clearStore$: Subject<Star> = createAction('clearStore$');

type Actions = {
  saveConservation$: Subject<Star>;
  uploadFile$: Subject<Star>;
  setLoading$: Subject<Flag>;
  getConservationAction$: Observable<Star>;
  updateConservationAction$: Observable<Star>;
  clearStore$: Subject<Star>;
  deleteConservationAction$: Subject<Star>;
};

const sortSubEvents = (data: TODO) => {
  if (data && data.events && data.events.length > 1) {
    const sortedEvents = sortBy(data.events, o => o.id);
    return { ...data, events: sortedEvents };
  } else {
    return data;
  }
};

export const reducer$ = (
  actions: Actions,
  ajaxGet: AjaxGet<Star>,
  ajaxPost: AjaxPost<Star>,
  ajaxPut: AjaxPut<Star>,
  ajaxDel: AjaxDel<Star>
): Observable<Reducer<ConservationStoreState>> => {
  return Observable.merge(
    actions.deleteConservationAction$.map(() => (state: ConservationStoreState) => ({
      ...state
    })),
    actions.saveConservation$
      .switchMap(saveConservationAction(ajaxPost, ajaxPut))
      .map(saveResult => (state: ConservationStoreState) => ({ ...state, saveResult })),
    actions.uploadFile$
      .switchMap(uploadFileAction(ajaxPost, ajaxPut))
      .map(saveResult => (state: ConservationStoreState) => ({ ...state, saveResult })),
    actions.setLoading$.map(loading => (state: ConservationStoreState) => ({
      ...state,
      ...loading
    })),
    actions.clearStore$.map(() => () => initialState),
    Observable.merge(
      actions.getConservationAction$,
      actions.updateConservationAction$
    ).map(conservation => (state: ConservationStoreState) => ({
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
    deleteConservationAction$: deleteConservationAction$ as TODO
  },
  ajaxGet: AjaxGet<Star> = simpleGet,
  ajaxPost: AjaxPost<Star> = simplePost,
  ajaxPut: AjaxPost<Star> = simplePut,
  ajaxDel: AjaxDel<Star> = simpleDel
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
  [key: string]: Array<SampleType>;
};

export function getConservationDetails(
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
): (conservation: ConservationCollection) => Observable<Star> {
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
                e => e.actorsAndRoles && e.actorsAndRoles.map((a: TODO) => a.actorId)
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
  museumId: number;
  collectionId: string;
  token: string;
  sampleTypes: SampleTypes;
};

export function getEventObjectDetails(
  props: AjaxParams,
  ajaxGet: AjaxGet<Star>
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
          const od = arrayOfObjectDetails.find((objD: TODO) => {
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
        actorName: a && a.fn
      };
    });
  }
  return [];
}

const saveConservation = (ajaxPost: AjaxPost<TODO>, ajaxPut: AjaxPut<TODO>) => ({
  id,
  result,
  appSession,
  data,
  callback
}: TODO) => {
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

function getConservationUpsert(
  id: TODO,
  ajaxPut: AjaxPut<TODO>,
  museumId: TODO,
  data: TODO,
  token: TODO,
  ajaxPost: AjaxPost<TODO>,
  callback: TODO
) {
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

const uploadDocumentAndSaveConservation = (
  ajaxPost: AjaxPost<TODO>,
  ajaxPut: AjaxPut<TODO>
) => ({
  eventId,
  parentEventId,
  museumId,
  collectionId,
  token,
  files,
  data,
  callback
}: TODO) => {
  if (!eventId) {
    return Observable.empty();
  }

  const files$ =
    files.length > 0
      ? Observable.forkJoin(
          files.map((file: File) =>
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

  return files$.flatMap((files: File[]) => {
    const newFids = files.reduce((acc, f) => {
      if ((f as TODO).fid) {
        return [...acc, (f as TODO).fid];
      }
      return acc;
    }, []);
    const badFiles = files.filter(f => !(f as TODO).fid);
    const findEvent =
      data && data.events && data.events.find((f: TODO) => f.id === eventId);
    const existingFids = findEvent ? findEvent.documents : [];
    const fids = existingFids.concat(newFids);

    const updatedEvent = { ...findEvent, documents: fids };
    const remaingEvents =
      data && data.events && data.events.filter((f: TODO) => f.id !== eventId);
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
            results: (results as TODO).results,
            badFiles
          });
        }
      });
  });
};
