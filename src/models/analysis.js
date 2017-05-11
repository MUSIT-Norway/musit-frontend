// @flow
import { simpleGet, simplePost, simplePut } from '../shared/RxAjax';
import Config from '../config';
import MusitActor from './actor';
import MusitObject from './object';
import { Observable } from 'rxjs';
import moment from 'moment';
import type { Field } from '../forms/form';
import type { Callback, AjaxGet, AjaxPost, AjaxPut } from './types/ajax';

export type Restriction = {
  requester?: ?string,
  reason?: ?string,
  expirationDate?: ?string,
  cancelledReason?: string,
  caseNumbers?: Array<string>
};

export type Result = {
  extRef?: Array<string>,
  comment?: ?string
};

export type Analysis = {
  id: string,
  registeredBy: string,
  caseNumbers?: ?Array<string>,
  restriction?: ?Restriction,
  result?: Result
};

export type AnalysisType = {
  id: string
  // TODO TBD
};

type FormValue = {
  name: string,
  defaultValue: ?string | boolean | Array<any>
};

class MusitAnalysis {
  static fromJsonToForm: (json: Analysis, fields: Array<Field<*>>) => Array<FormValue>;

  static getAnalysisTypesForCollection: (ajaxGet: AjaxGet) => (
    props: {
      museumId: number,
      collectionId: string,
      token: string,
      callback?: ?Callback
    }
  ) => Observable;

  static saveAnalysisEvent: (ajaxPost: AjaxPost) => (
    props: {
      museumId: number,
      data: AnalysisType,
      token: string,
      callback?: ?Callback
    }
  ) => Observable;

  static editAnalysisEvent: (ajaxPut: AjaxPut) => (
    props: {
      id: number,
      museumId: number,
      data: Analysis,
      token: string,
      callback?: ?Callback
    }
  ) => Observable;

  static getAnalysesForObject: (ajaxGet: AjaxGet) => (
    props: {
      id: number,
      museumId: number,
      token: string,
      callback?: ?Callback
    }
  ) => Observable;

  static getAnalysisById: (ajaxGet: AjaxGet) => (
    props: {
      id: number,
      museumId: number,
      token: string,
      callback?: ?Callback
    }
  ) => Observable;

  static getAnalysisWithDetails: (ajaxGet: AjaxGet, ajaxPost: AjaxPost) => (
    props: {
      id: number,
      museumId: number,
      collectionId: string,
      token: string,
      callback?: ?Callback
    }
  ) => Observable;

  static getAnalysisTypes: (ajaxGet: AjaxGet) => (
    props: {
      museumId: number,
      token: string,
      callback?: ?Callback
    }
  ) => Observable;

  static saveAnalysisType: (ajaxPost: AjaxPost) => (
    props: {
      museumId: number,
      data: AnalysisType,
      token: string,
      callback?: ?Callback
    }
  ) => Observable;

  static addResult: (ajaxPost: AjaxPost) => (
    props: {
      analysisId: number,
      museumId: number,
      token: string,
      result: {
        extRef?: ?Array<string>,
        comment?: ?string
      }
    }
  ) => Observable;
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

  const restriction = json.restriction;
  formValues.restrictions = toField('restrictions', !!restriction);
  if (restriction) {
    formValues.restrictions_requester = toField(
      'restrictions_requester',
      restriction.requester
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
      moment(restriction.expirationDate).format('YYYY-MM-DD')
    );
  }

  const result = json.result;
  if (result) {
    formValues.comments = toField('comments', result.comment);
    formValues.externalSource = toField('externalSource', result.extRef);
  }

  return Object.keys(formValues).map(key => formValues[key]);
};

MusitAnalysis.getAnalysisTypesForCollection = (ajaxGet = simpleGet) =>
  ({ museumId, collectionId, token, callback }) => {
    const url = Config.magasin.urls.api.analysisType.getAnalysisTypesForCollection(
      museumId,
      collectionId
    );
    return ajaxGet(url, token, callback).map(({ response }) => response);
  };

MusitAnalysis.saveAnalysisEvent = (ajaxPost = simplePost) =>
  ({ museumId, data, token, callback }) => {
    const url = Config.magasin.urls.api.analysis.saveAnalysisEvent(museumId);
    return ajaxPost(url, data, token, callback).map(({ response }) => response);
  };

MusitAnalysis.editAnalysisEvent = (ajaxPut = simplePut) =>
  ({ id, museumId, data, token, callback }) => {
    const url = Config.magasin.urls.api.analysis.getAnalysisById(museumId, id);
    return ajaxPut(url, data, token, callback).map(({ response }) => response);
  };

MusitAnalysis.getAnalysesForObject = (ajaxGet = simpleGet) =>
  ({ museumId, token, id, callback }) => {
    const url = Config.magasin.urls.api.analysis.analysesForObject(museumId, id);
    return ajaxGet(url, token, callback).map(({ response }) => {
      if (!Array.isArray(response)) {
        return [];
      }
      return response;
    });
  };

MusitAnalysis.getAnalysisById = (ajaxGet = simpleGet) =>
  ({ museumId, id, token, callback }) => {
    const url = Config.magasin.urls.api.analysis.getAnalysisById(museumId, id);
    return ajaxGet(url, token, callback).map(({ response }) => response);
  };

MusitAnalysis.getAnalysisWithDetails = (ajaxGet = simpleGet, ajaxPost = simplePost) =>
  props =>
    MusitAnalysis.getAnalysisById(ajaxGet)(props)
      .flatMap(analysis =>
        MusitActor.getActors(ajaxPost)({
          actorIds: [analysis.registeredBy, analysis.updatedBy].filter(p => p),
          token: props.token
        }).map(actors => {
          if (actors) {
            const actorNames = MusitActor.getMultipleActorNames(actors, [
              {
                id: analysis.updatedBy,
                fieldName: 'updatedByName'
              },
              {
                id: analysis.registeredBy,
                fieldName: 'registeredByName'
              }
            ]);
            return { ...analysis, ...actorNames };
          }
          return analysis;
        }))
      .flatMap(analysis => {
        if (analysis.type === 'AnalysisCollection' && analysis.events.length > 0) {
          return Observable.forkJoin(
            analysis.events.map(a =>
              MusitObject.getObjectDetails(ajaxGet)({
                id: a.objectId,
                museumId: props.museumId,
                collectionId: props.collectionId,
                token: props.token
              }))
          ).map(arrayOfObjectDetails => {
            const actualValues = arrayOfObjectDetails.filter(a => a);
            if (actualValues.length === 0) {
              return analysis;
            }
            const events = analysis.events.map(e => {
              const od = arrayOfObjectDetails.find(objD => objD.uuid === e.objectId);
              return od
                ? { ...e, term: od.term, museumNo: od.museumNo, subNo: od.subNo }
                : e;
            });
            return { ...analysis, events: events };
          });
        }
        if (!analysis.objectId) {
          return Observable.of(analysis);
        }
        return MusitObject.getObjectDetails(ajaxGet)({
          id: analysis.objectId,
          museumId: props.museumId,
          collectionId: props.collectionId,
          token: props.token
        }).map(object => {
          if (!object) {
            return analysis;
          }
          return {
            ...analysis,
            museumNo: object.museumNo,
            subNo: object.subNo,
            term: object.term
          };
        });
      });

MusitAnalysis.getAnalysisTypes = (ajaxGet = simpleGet) =>
  ({ museumId, token, callback }) => {
    const url = Config.magasin.urls.api.analysisType.getAllAnalysisTypes(museumId);
    return ajaxGet(url, token, callback).map(r => r.response);
  };

MusitAnalysis.saveAnalysisType = (ajaxPost = simplePost) =>
  ({ museumId, data, token, callback }) => {
    const url = Config.magasin.urls.api.analysis.saveAnalysisType(museumId);
    return ajaxPost(url, data, token, callback).map(({ response }) => response);
  };

MusitAnalysis.addResult = (ajaxPost = simplePost) =>
  ({ analysisId, museumId, token, result }) =>
    ajaxPost(
      Config.magasin.urls.api.analysis.resultsUrl(museumId, analysisId),
      result,
      token
    );

export default MusitAnalysis;
