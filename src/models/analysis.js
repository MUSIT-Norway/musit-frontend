// @flow
import { simpleGet, simplePost, simplePut } from '../shared/RxAjax';
import Config from '../config';
import { Observable } from 'rxjs';
import type { Field } from '../forms/form';
import type { Callback, AjaxGet, AjaxPost, AjaxPut } from './types/ajax';
import type { AnalysisCollection, Result, Restriction } from '../types/analysis';
import type { CollectionId } from 'types/ids';
import type { ImportAnalysisResult } from 'types/analysisResult';

export type AnalysisSavePayload = {
  doneBy?: ?string,
  doneDate?: ?string,
  responsible?: ?string,
  administrator?: ?string,
  completedBy?: ?string,
  completedDate?: ?string,
  caseNumbers?: ?Array<string>,
  restriction?: ?Restriction,
  result?: ?Result
};

type AnalysisTypeSavePayload = {};

type AnalysisResultSavePayload = {
  extRef?: ?Array<string>,
  comment?: ?string
};

export type FormValue = {
  name: string,
  defaultValue: ?string | boolean | Array<any>
};

class MusitAnalysis {
  static fromJsonToForm: (
    json: AnalysisCollection,
    fields: Array<Field<*>>
  ) => Array<FormValue>;

  static getAnalysisTypesForCollection: (
    ajaxGet: AjaxGet
  ) => (props: {
    museumId: number,
    collectionId: string,
    token: string,
    callback?: Callback
  }) => Observable;

  static saveAnalysisEvent: (
    ajaxPost: AjaxPost
  ) => (props: {
    museumId: number,
    data: AnalysisSavePayload,
    token: string,
    callback?: Callback
  }) => Observable;

  static editAnalysisEvent: (
    ajaxPut: AjaxPut
  ) => (props: {
    id: number,
    museumId: number,
    data: AnalysisSavePayload,
    token: string,
    callback?: Callback
  }) => Observable;

  static getAnalysesForObject: (
    ajaxGet: AjaxGet
  ) => (props: {
    id: number,
    museumId: number,
    token: string,
    callback?: Callback
  }) => Observable;

  static getAnalysisById: (
    ajaxGet: AjaxGet
  ) => (props: {
    id: number,
    museumId: number,
    token: string,
    callback?: Callback
  }) => Observable;

  static getAnalysisTypes: (
    ajaxGet: AjaxGet
  ) => (props: {
    museumId: number,
    token: string,
    callback?: Callback
  }) => Observable;

  static getAnalysisCategories: (
    ajaxGet: AjaxGet
  ) => (props: {
    museumId: number,
    token: string,
    callback?: Callback
  }) => Observable;

  static getPurposes: (
    ajaxGet: AjaxGet
  ) => (props: {
    token: string,
    callback?: Callback
  }) => Observable;

  static saveAnalysisType: (
    ajaxPost: AjaxPost
  ) => (props: {
    museumId: number,
    data: AnalysisTypeSavePayload,
    token: string,
    callback?: Callback
  }) => Observable;

  static addResult: (
    ajaxPost: AjaxPost
  ) => (props: {
    analysisId: number,
    museumId: number,
    token: string,
    result: ?AnalysisResultSavePayload,
    callback?: Callback
  }) => Observable;

  static importResult: (
    ajaxPost: AjaxPost
  ) => (props: {
    analysisId: number,
    museumId: number,
    token: string,
    result: ImportAnalysisResult
  }) => Observable;

  static loadPredefinedTypes: (
    ajaxGet: AjaxGet
  ) => (props: {
    museumId: number,
    token: string,
    onComplete: (predefinedTypes: mixed) => void
  }) => Observable;

  static getAnalysisLabList: (
    ajaxGet: AjaxGet
  ) => (props: {
    token: string
  }) => Observable;

  static getAnalysisEvents: (
    ajaxGet: AjaxGet
  ) => (props: {
    museumId: number,
    token: string,
    collectionId: CollectionId
  }) => Observable;
}

const toField = (
  name: string,
  defaultValue: ?string | boolean | Array<any>
): FormValue => ({
  name,
  defaultValue
});

MusitAnalysis.fromJsonToForm = (json, formDef) => {
  const formValues = formDef.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: toField(field.name, json[field.name])
    }),
    {}
  );

  let persons = [];
  if (formValues.doneBy && formValues.doneBy.defaultValue) {
    persons = persons.concat([
      {
        name: json.doneByName,
        uuid: json.doneBy,
        role: 'doneBy',
        date: json.doneDate
      }
    ]);
  }

  if (formValues.responsible && formValues.responsible.defaultValue) {
    persons = persons.concat([
      {
        name: json.responsibleName,
        uuid: json.responsible,
        role: 'responsible',
        date: null
      }
    ]);
  }

  if (formValues.administrator && formValues.administrator.defaultValue) {
    persons = persons.concat([
      {
        name: json.administratorName,
        uuid: json.administrator,
        role: 'administrator',
        date: null
      }
    ]);
  }

  if (formValues.completedBy && formValues.completedBy.defaultValue) {
    persons = persons.concat([
      {
        name: json.completedByName,
        uuid: json.completedBy,
        role: 'completedBy',
        date: json.completedDate
      }
    ]);
  }
  formValues.persons = toField('persons', persons);

  const restriction = json.restriction;
  formValues.restrictions = toField('restrictions', !!restriction);
  if (restriction) {
    formValues.restrictions_requester = toField(
      'restrictions_requester',
      restriction.requester
    );
    formValues.restrictions_requesterName = toField(
      'restrictions_requesterName',
      restriction.requesterName
    );
    formValues.restrictions_reason = toField('restrictions_reason', restriction.reason);
    formValues.restrictions_caseNumbers = toField(
      'restrictions_caseNumbers',
      restriction.caseNumbers
    );
    formValues.restrictions_cancelledReason = toField(
      'restrictions_cancelledReason',
      restriction.cancelledReason
    );
    formValues.restrictions_expirationDate = toField(
      'restrictions_expirationDate',
      restriction.expirationDate
    );
  }

  const result = json.result;
  if (result) {
    formValues.comments = toField('comments', result.comment);
    formValues.externalSource = toField('externalSource', result.extRef);
  }

  return Object.keys(formValues).map(key => formValues[key]);
};

MusitAnalysis.getAnalysisTypesForCollection = (ajaxGet = simpleGet) => ({
  museumId,
  collectionId,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.analysisType.getAnalysisTypesForCollection(
    museumId,
    collectionId
  );
  return ajaxGet(url, token, callback).map(({ response }) => response);
};

MusitAnalysis.saveAnalysisEvent = (ajaxPost = simplePost) => ({
  museumId,
  data,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.analysis.saveAnalysisEvent(museumId);
  return ajaxPost(url, data, token, callback).map(({ response }) => response);
};

MusitAnalysis.editAnalysisEvent = (ajaxPut = simplePut) => ({
  id,
  museumId,
  data,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.analysis.getAnalysisById(museumId, id);
  return ajaxPut(url, data, token, callback).map(({ response }) => response);
};

MusitAnalysis.getAnalysesForObject = (ajaxGet = simpleGet) => ({
  museumId,
  token,
  id,
  callback
}) => {
  const url = Config.magasin.urls.api.analysis.analysesForObject(museumId, id);
  return ajaxGet(url, token, callback).map(({ response }) => {
    if (!Array.isArray(response)) {
      return [];
    }
    return response;
  });
};

MusitAnalysis.getAnalysisById = (ajaxGet = simpleGet) => ({
  museumId,
  id,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.analysis.getAnalysisById(museumId, id);
  return ajaxGet(url, token, callback).map(({ response }) => response);
};

MusitAnalysis.getAnalysisTypes = (ajaxGet = simpleGet) => ({
  museumId,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.analysisType.getAllAnalysisTypes(museumId);
  return ajaxGet(url, token, callback).map(r => r.response);
};

MusitAnalysis.saveAnalysisType = (ajaxPost = simplePost) => ({
  museumId,
  data,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.analysis.saveAnalysisType(museumId);
  return ajaxPost(url, data, token, callback).map(({ response }) => response);
};

MusitAnalysis.addResult = (ajaxPost = simplePost) => ({
  analysisId,
  museumId,
  token,
  result,
  callback
}) =>
  ajaxPost(
    Config.magasin.urls.api.analysis.resultsUrl(museumId, analysisId),
    result,
    token,
    callback
  );

MusitAnalysis.importResult = (ajaxPut = simplePut) => ({
  analysisId,
  museumId,
  token,
  result
}) =>
  ajaxPut(
    Config.magasin.urls.api.analysis.importResults(museumId, analysisId),
    result,
    token
  );

MusitAnalysis.getPurposes = (ajaxGet = simpleGet) => ({ token, callback }) =>
  ajaxGet(Config.magasin.urls.api.analysis.getPurposes, token, callback).map(
    ({ response }) => response
  );

MusitAnalysis.getAnalysisLabList = (ajaxGet = simpleGet) => ({ token }) =>
  ajaxGet(Config.magasin.urls.api.actor.getLabList, token)
    .map(({ response }) => response)
    .do(function onError() {
      return [];
    });

MusitAnalysis.getAnalysisCategories = (ajaxGet = simpleGet) => ({ museumId, token }) =>
  ajaxGet(
    Config.magasin.urls.api.analysisType.getAnalysisCategories(museumId),
    token
  ).map(({ response }) => response);

MusitAnalysis.loadPredefinedTypes = (ajaxGet = simpleGet) => ({
  museumId,
  token,
  onComplete
}) => {
  return Observable.forkJoin([
    MusitAnalysis.getAnalysisCategories(ajaxGet)({ museumId, token }),
    MusitAnalysis.getPurposes(ajaxGet)({ museumId, token }),
    MusitAnalysis.getAnalysisTypes(ajaxGet)({ museumId, token }),
    MusitAnalysis.getAnalysisLabList(ajaxGet)({ token })
  ])
    .map(([categories, purposes, analysisTypes, analysisLabList]) => ({
      categories: categories.reduce((a, c) => Object.assign(a, { [c.id]: c.name }), {}),
      purposes,
      analysisTypes,
      analysisLabList
    }))
    .do(onComplete);
};

MusitAnalysis.getAnalysisEvents = (ajaxGet = simpleGet) => ({
  museumId,
  token,
  collectionId
}) => {
  const url = Config.magasin.urls.api.analysis.getAnalysisEvents(museumId, [
    collectionId
  ]);
  return ajaxGet(url, token).map(extractResponseArray);
};

export const extractResponseArray = (httpResponse: any) => {
  if (httpResponse.status === 204) {
    return [];
  } else {
    return httpResponse.response;
  }
};

export default MusitAnalysis;
