// @flow
import { simpleGet, simplePost, simplePut } from '../shared/RxAjax';
import Config from '../config';
import MusitActor from './actor';
import MusitObject from './object';
import Sample from './sample';
import { Observable } from 'rxjs';
import moment from 'moment';
import type { Field } from '../forms/form';
import type { Callback, AjaxGet, AjaxPost, AjaxPut } from './types/ajax';
import flatten from 'lodash/flatten';
import { DATE_FORMAT_DISPLAY } from '../shared/util';

export type Restriction = {
  requester?: string,
  requesterName?: string,
  reason?: string,
  expirationDate?: string,
  cancelledReason?: string,
  caseNumbers?: Array<string>
};

export type Result = {
  extRef?: Array<string>,
  comment?: string
};

export type Analysis = {
  id: string,
  registeredBy: string,
  doneBy?: string,
  doneDate?: string,
  doneByName?: string,
  responsible?: string,
  responsibleName?: string,
  administrator?: string,
  administratorName?: string,
  completedBy?: string,
  completedByName?: string,
  completedDate?: string,
  caseNumbers?: Array<string>,
  restriction?: Restriction,
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
    data: AnalysisType,
    token: string,
    callback?: Callback
  }) => Observable;

  static editAnalysisEvent: (
    ajaxPut: AjaxPut
  ) => (props: {
    id: number,
    museumId: number,
    data: Analysis,
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

  static getAnalysisWithDetails: (
    ajaxGet: AjaxGet,
    ajaxPost: AjaxPost
  ) => (props: {
    id: number,
    museumId: number,
    collectionId: string,
    token: string,
    callback?: Callback,
    sampleTypes: mixed
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
    data: AnalysisType,
    token: string,
    callback?: Callback
  }) => Observable;

  static addResult: (
    ajaxPost: AjaxPost
  ) => (props: {
    analysisId: number,
    museumId: number,
    token: string,
    result: {
      extRef?: ?Array<string>,
      comment?: ?string
    }
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
      moment(restriction.expirationDate).format(DATE_FORMAT_DISPLAY)
    );
  }

  const result = json.result;
  if (result) {
    formValues.comments = toField('comments', result.comment);
    formValues.externalSource = toField('externalSource', result.extRef);
  }

  console.log('FormValues', formValues);
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

function getEventObjectDetails(props, ajaxGet) {
  return event => {
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

function zipObjectInfoWithEvents(analysis) {
  return arrayOfObjectDetails => {
    const actualValues = arrayOfObjectDetails.filter(a => a);
    if (actualValues.length === 0) {
      return analysis;
    }
    const events = analysis.events.map(e => {
      const od = arrayOfObjectDetails.find(objD => {
        return objD.objectId === e.objectId || objD.uuid === e.objectId;
      });
      return od ? { ...e, ...od } : e;
    });
    return { ...analysis, events: events };
  };
}

function getActorNames(actors, analysis) {
  return MusitActor.getMultipleActorNames(actors, [
    {
      id: analysis.updatedBy,
      fieldName: 'updatedByName'
    },
    {
      id: analysis.registeredBy,
      fieldName: 'registeredByName'
    },
    {
      id: analysis.doneBy,
      fieldName: 'doneByName'
    },
    {
      id: analysis.responsible,
      fieldName: 'responsibleName'
    },
    {
      id: analysis.administrator,
      fieldName: 'administratorName'
    },
    {
      id: analysis.completedBy,
      fieldName: 'completedByName'
    },
    {
      id: analysis.restriction ? analysis.restriction.requester : '',
      fieldName: 'restriction_requesterName'
    }
  ]);
}

MusitAnalysis.getAnalysisWithDetails = (
  ajaxGet = simpleGet,
  ajaxPost = simplePost
) => props =>
  MusitAnalysis.getAnalysisById(ajaxGet)(props)
    .flatMap(analysis =>
      MusitActor.getActors(ajaxPost)({
        actorIds: [
          analysis.registeredBy,
          analysis.updatedBy,
          analysis.doneBy,
          analysis.responsible,
          analysis.administrator,
          analysis.completedBy,
          analysis.restriction ? analysis.restriction.requester : ''
        ].filter(p => p),
        token: props.token
      }).map(actors => {
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
    )
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
  result
}) =>
  ajaxPost(
    Config.magasin.urls.api.analysis.resultsUrl(museumId, analysisId),
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

export default MusitAnalysis;
