// @flow
import Config from '../../../config';
import type { AppSession } from '../../../types/appSession';
import type { Predefined } from './predefinedType';
import type { FormData } from './formType';
import type { Store } from './storeType';
import toArray from 'lodash/toArray';

export function getAnalysisTypeTerm(
  store: Store,
  predefined: Predefined,
  appSession: AppSession
) {
  if (store.analysis && store.analysis.analysisTypeId && predefined.analysisTypes) {
    const analysisTypeId = store.analysis.analysisTypeId;
    const foundType = predefined.analysisTypes.find(type => type.id === analysisTypeId);
    if (foundType) {
      return appSession.language.isEn ? foundType.enName : foundType.noName;
    }
  }
  return '';
}

type ObjectWithUuidAndType = { objectId: ?string, objectType: string };

export function getObjects(props: *) {
  return props.form.events.rawValue.length > 0
    ? props.form.events.rawValue
    : props.location.state || [];
}

export function getObjectsWithType(
  objects: [{ objectId: ?string, uuid: ?string, sampleNum?: number, objectType: string }]
): Array<ObjectWithUuidAndType> {
  return objects
    ? objects.map(obj => ({
        objectId: obj.objectId || obj.uuid,
        objectType: obj.sampleNum ? 'sample' : obj.objectType
      }))
    : [];
}

const doSaveAnalysisResult = function(
  saveResult,
  appSession,
  result,
  events,
  analysisId,
  onComplete
) {
  const params = {
    token: appSession.accessToken,
    museumId: appSession.museumId
  };
  return Promise.all(
    events
      .map(evt => {
        const newVar = {
          ...params,
          result: { ...evt.result, type: 'GenericResult' },
          analysisId: evt.id
        };
        return saveResult(newVar);
      })
      .concat(
        saveResult({
          ...params,
          result,
          analysisId
        })
      )
  ).then(onComplete);
};

type SaveAnalysisFn = (props: {
  museumId: number,
  data: mixed,
  token: string
}) => Promise<*>;

type SaveResultFn = (props: {
  museumId: number,
  result: mixed,
  token: string
}) => Promise<*>;

export function submitForm(
  appSession: AppSession,
  form: FormData,
  objects: Array<ObjectWithUuidAndType>,
  saveAnalysisEvent: SaveAnalysisFn,
  saveResult: SaveResultFn,
  goToUrl: (s: string) => void
) {
  const restriction = form.restrictions.value
    ? {
        requester: form.restrictions_requester.value,
        expirationDate: form.restrictions_expirationDate.value,
        reason: form.restrictions_reason.value,
        caseNumbers: form.restrictions_caseNumbers.value,
        cancelledReason: form.restrictions_cancelledReason.value
      }
    : null;

  const externalSource = form.externalSource.value;
  const comments = form.comments.value;
  debugger;
  const result = externalSource || comments
    ? {
        extRef: externalSource,
        comment: comments,
        type: 'GenericResult'
      }
    : null;

  const doneBy =
    form.persons &&
    Array.isArray(form.persons.rawValue) &&
    form.persons.rawValue.find(p => p.role === 'doneBy');

  const responsible =
    form.persons &&
    Array.isArray(form.persons.rawValue) &&
    form.persons.rawValue.find(p => p.role === 'responsible');

  const administrator =
    form.persons &&
    Array.isArray(form.persons.rawValue) &&
    form.persons.rawValue.find(p => p.role === 'administrator');

  const completedBy =
    form.persons &&
    Array.isArray(form.persons.rawValue) &&
    form.persons.rawValue.find(p => p.role === 'completedBy');

  const data = {
    analysisTypeId: form.analysisTypeId.value,
    doneBy: doneBy && doneBy.uuid,
    doneDate: doneBy && doneBy.date,
    note: form.note.value,
    responsible: responsible && responsible.uuid,
    administrator: administrator && administrator.uuid,
    completedBy: completedBy && completedBy.uuid,
    completedDate: completedBy && completedBy.date,
    orgId: form.orgId.value,
    restriction,
    objects,
    caseNumbers: form.caseNumbers.value,
    status: form.status.value,
    reason: form.reason.value,
    type: 'AnalysisCollection'
  };

  return saveAnalysisEvent({
    id: form.id.value,
    museumId: appSession.museumId,
    data: data,
    token: appSession.accessToken
  }).then(
    (analysis: {
      id: number,
      events: [{ id: number, objectId: string, objectType: string }]
    }) => {
      const analysisId = typeof analysis === 'number' ? analysis : analysis.id;
      const url = Config.magasin.urls.client.analysis.viewAnalysis(
        appSession,
        analysisId
      );
      if (result) {
        return doSaveAnalysisResult(
          saveResult,
          appSession,
          result,
          toArray(form.events.value).map(evt => {
            const event = analysis.events.find(
              evtFromServer => evtFromServer.objectId === evt.objectId || evt.uuid
            );
            return { ...evt, id: event ? event.id : null };
          }),
          analysisId,
          () => goToUrl(url)
        );
      } else {
        goToUrl(url);
      }
    }
  );
}
