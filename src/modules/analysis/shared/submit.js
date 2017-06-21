// @flow
import type {
  AnalysisType,
  ExtraResultAttributeValues,
  Size
} from '../../../types/analysisTypes';
import type { AppSession, Language } from '../../../types/appSession';
import type { ObjectData } from '../../../types/object';
import type { History } from '../../../types/Routes';
import type { SampleData } from '../../../types/samples';
import type { Result } from '../../../types/analysisTypes';
import toArray from 'lodash/toArray';
import { Observable } from 'rxjs';
import MusitAnalysis from '../../../models/analysis';
import type { AnalysisSavePayload } from '../../../models/analysis';
import Config from '../../../config';
import type { FormData } from './formType';

type ObjectWithUuidAndType = { objectId: ?string, objectType: string };

type Analysis = {
  id: number,
  events: ?Array<ObjectData & SampleData>
};

export type Location = {
  state?: Array<ObjectData & SampleData>
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
  return upsertAnalysis$.toPromise().then((analysis: Analysis) =>
    Observable.forkJoin(
      zipEventsWithId(events, analysis.events)
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
        )
    )
      .toPromise()
      .then(() =>
        history.push(
          Config.magasin.urls.client.analysis.viewAnalysis(
            appSession,
            parseInt(analysis.id, 10)
          )
        )
      )
  );
}

function getAnalysisUpsert(id, ajaxPut, museumId, data, token, ajaxPost) {
  return id
    ? MusitAnalysis.editAnalysisEvent(ajaxPut)({
        id,
        museumId,
        data,
        token
      })
    : MusitAnalysis.saveAnalysisEvent(ajaxPost)({ museumId, data, token });
}

function getRestrictions(form: FormData) {
  return form.restrictions.value
    ? {
        requester: form.restrictions_requester.value,
        expirationDate: form.restrictions_expirationDate.value,
        reason: form.restrictions_reason.value,
        caseNumbers: form.restrictions_caseNumbers.value,
        cancelledReason: form.restrictions_cancelledReason.value
      }
    : null;
}

export function getResult(
  form: FormData,
  extraResultAttributes: ExtraResultAttributeValues
) {
  const extRef = toArray(form.externalSource.value);
  const comment = form.comments.value;
  const extraAttributes = Object.keys(extraResultAttributes).reduce((acc, att) => {
    let value = extraResultAttributes[att];
    if (value && typeof value !== 'string' && value.type === 'Size') {
      const size: Size = (value.value: any);
      value = { ...size, rawValue: undefined };
    }
    if (value && typeof value !== 'string' && value.type === 'String') {
      value = (value.value: any);
    }
    return {
      ...acc,
      [att]: value
    };
  }, {});
  return extRef || comment
    ? {
        extRef,
        comment,
        ...extraAttributes,
        type: extraResultAttributes.type && extraResultAttributes.type.toString()
      }
    : null;
}

export function getAnalysisCollection(
  form: FormData,
  extraAttributes: mixed,
  location: Location
) {
  const persons = form.persons.value;
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
    objects: getObjectsWithType(getObjects((form.events.value: any), location)),
    restriction: getRestrictions(form),
    extraAttributes: extraAttributes,
    caseNumbers: form.caseNumbers.value,
    status: form.status.value,
    reason: form.reason.value,
    type: 'AnalysisCollection'
  };
}

function findPerson(persons, role) {
  return toArray(persons).find(p => p.role === role);
}

export function getAnalysisType(
  analysisTypeId: ?number,
  analysisTypes: Array<AnalysisType>
): ?AnalysisType {
  return analysisTypes && analysisTypes.find(at => at.id === analysisTypeId);
}

export function getObjects(
  formEvents: Array<ObjectData & SampleData>,
  location: Location
): Array<ObjectData & SampleData> {
  return formEvents.length > 0 ? formEvents : location.state || [];
}

export function getObjectsWithType(
  objects: Array<ObjectData & SampleData>
): Array<ObjectWithUuidAndType> {
  if (!objects) {
    return [];
  }
  return objects.map((obj: ObjectData & SampleData) => ({
    objectId: obj.objectId || obj.uuid,
    objectType: obj.sampleNum ? 'sample' : obj.objectType
  }));
}

export function getAnalysisTypeTerm(
  analysis: ?Analysis,
  analysisTypes: Array<AnalysisType>,
  language: Language
): string {
  if (analysis && analysis.analysisTypeId && analysisTypes) {
    const analysisTypeId = analysis.analysisTypeId;
    const foundType = analysisTypes.find(type => type.id === analysisTypeId);
    if (foundType) {
      return language.isEn ? foundType.enName : foundType.noName;
    }
  }
  return '';
}

function zipEventsWithId(formEvents, apiEvents) {
  return formEvents.map(evt => {
    const event =
      apiEvents &&
      apiEvents.find(
        evtFromServer => evtFromServer.objectId === evt.objectId || evt.uuid
      );
    return { ...evt, id: event ? event.id : null };
  });
}
