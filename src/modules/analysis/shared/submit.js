// @flow
import type {
  ExtraResultAttributeValues,
  Size,
  AnalysisCollection,
  AnalysisEvent
} from '../../../types/analysis';
import type { AppSession } from '../../../types/appSession';
import type { ObjectData } from '../../../types/object';
import type { History } from '../../../types/Routes';
import type { SampleData } from '../../../types/samples';
import type { Result } from '../../../types/analysis';
import toArray from 'lodash/toArray';
import omit from 'lodash/omit';
import keys from 'lodash/keys';
import { Observable } from 'rxjs';
import MusitAnalysis from '../../../models/analysis';
import type { AnalysisSavePayload } from '../../../models/analysis/analysis';
import Config from '../../../config';
import type { FormData } from './formType';
import { emitError, emitSuccess } from '../../../shared/errors';
import { I18n } from 'react-i18nify';
import type { Restriction } from '../../../types/analysis';

type ObjectWithUuidAndType = { objectId: ?string, objectType: ?string };

export type Location<T> = {
  state?: T
};

const getArrayOfResultsToSave = function(
  events,
  analysis,
  ajaxPost,
  token,
  museumId,
  result
): Array<Observable<number>> {
  return zipEventsWithId(events, analysis.events)
    .map(evt =>
      MusitAnalysis.addResult(ajaxPost)({
        token,
        museumId,
        result: { ...evt.result, type: result && result.type },
        analysisId: parseInt(evt.id, 10)
      })
    )
    .concat(
      MusitAnalysis.addResult(ajaxPost)({
        token,
        museumId,
        result,
        analysisId: parseInt(analysis.id, 10)
      })
    );
};

export function submitForm(
  id: ?number,
  result: ?Result,
  appSession: AppSession,
  history: History,
  data: AnalysisSavePayload,
  events: Array<ObjectData & SampleData>,
  ajaxPost: (url: string) => Observable<*>,
  ajaxPut: (url: string) => Observable<*>
) {
  const token = appSession.accessToken;
  const museumId = appSession.museumId;
  const upsertAnalysis$ = getAnalysisUpsert(id, ajaxPut, museumId, data, token, ajaxPost);
  return upsertAnalysis$.toPromise().then((analysis?: AnalysisCollection) => {
    if (!analysis) {
      return Observable.empty();
    }
    // $FlowFixMe | We are passing an array to forkJoin which is not supported by flow-typed definition for rxjs.
    return Observable.forkJoin(
      getArrayOfResultsToSave(events, analysis, ajaxPost, token, museumId, result)
    )
      .toPromise()
      .then(() => {
        if (analysis) {
          return history.push(
            Config.magasin.urls.client.analysis.viewAnalysis(
              appSession,
              parseInt(analysis.id, 10)
            )
          );
        }
      });
  });
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

function getRestrictions(form: FormData): ?Restriction {
  return form.restrictions.value ? (form.restriction.value: any) : null;
}

export function getResult(
  form: FormData,
  extraResultAttributes: ?ExtraResultAttributeValues
) {
  const extraAttributeType =
    extraResultAttributes && extraResultAttributes.type
      ? extraResultAttributes.type.toString()
      : 'GenericResult';
  const extraAttributes = keys(extraResultAttributes).reduce((acc, att) => {
    let value = extraResultAttributes && extraResultAttributes[att];
    if (value && typeof value !== 'string' && value.type === 'Size') {
      const size: Size = (value.value: any);
      value = omit(size, ['rawValue']);
    }
    if (value && typeof value !== 'string' && value.type === 'String') {
      value = (value.value: any);
    }
    if (keys(value).length === 0) {
      return acc;
    }
    return {
      ...acc,
      [att]: value
    };
  }, {});
  return {
    extRef: toArray(form.externalSource.value),
    comment: form.comments.value,
    ...extraAttributes,
    type: extraAttributeType
  };
}

export function getAnalysisCollection(
  form: FormData,
  extraDescriptionAttributes: ?mixed,
  location: Location<Array<AnalysisEvent>>
) {
  const events = toArray(form.events.value);
  const persons = toArray(form.persons.value);
  const doneBy = findPerson(persons, 'doneBy');
  const responsible = findPerson(persons, 'responsible');
  const administrator = findPerson(persons, 'administrator');
  const completedBy = findPerson(persons, 'completedBy');
  return {
    analysisTypeId: form.analysisTypeId.value,
    doneBy: doneBy && doneBy.uuid,
    doneDate: doneBy && doneBy.date,
    note: form.note.value,
    responsible: responsible && responsible.uuid,
    administrator: administrator && administrator.uuid,
    completedBy: completedBy && completedBy.uuid,
    completedDate: completedBy && completedBy.date,
    orgId: form.orgId.value,
    objects: getObjectsWithType(getObjects(events, location)),
    restriction: getRestrictions(form),
    extraAttributes: extraDescriptionAttributes,
    caseNumbers: form.caseNumbers.value,
    status: form.status.value,
    reason: form.reason.value,
    type: 'AnalysisCollection'
  };
}

function findPerson(persons, role) {
  return persons.find(p => p.role === role);
}

export function getObjects(
  formEvents: Array<AnalysisEvent>,
  location: Location<Array<AnalysisEvent>>
): Array<AnalysisEvent> {
  return formEvents.length > 0 ? formEvents : location.state || [];
}

export function getObjectsWithType(
  objects: Array<AnalysisEvent>
): Array<ObjectWithUuidAndType> {
  if (!objects) {
    return [];
  }
  return objects.map((obj: AnalysisEvent) => ({
    objectId: obj.sampleData
      ? obj.sampleData.objectId
      : obj.objectData && obj.objectData.uuid,
    objectType:
      obj.sampleData && obj.sampleData.sampleNum
        ? 'sample'
        : obj.objectData ? obj.objectData.objectType : null
  }));
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
