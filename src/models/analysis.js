import { simpleGet, simplePost, simplePut } from '../shared/RxAjax';
import Config from '../config';
import MusitActor from './actor';
import MusitObject from './object';
import { Observable } from 'rxjs';
import moment from 'moment';

class Analysis {}

Analysis.fromJsonToForm = (
  json: any
): Array<{ name: string, defaultValue: string | boolean }> => {
  // auxiliary method for converting to field
  const toField = (name, defaultValue) => ({ name, defaultValue });
  // Convert json to an object of form fields
  const form = Object.keys(json).reduce(
    (acc, key) => ({ ...acc, [key]: toField(key, json[key]) }),
    {}
  );
  // custom mapping of composite structures from json to form
  form.caseNumber = toField(
    'caseNumber',
    form.caseNumbers ? form.caseNumbers.defaultValue[0] : null
  );
  const restriction = form.restriction && form.restriction.defaultValue;
  form.restrictiona = toField('restrictions', !!restriction);
  if (restriction) {
    form.requester = toField('requester', restriction.requester);
    form.reason = toField('reason', restriction.reason);
    form.expirationDate = toField(
      'expirationDate',
      moment(restriction.expirationDate).format('YYYY-MM-DD')
    );
  }
  // return an array of form fields
  return Object.keys(form).map(key => form[key]);
};

Analysis.getAnalysisTypesForCollection = (ajaxGet = simpleGet) =>
  ({ museumId, collectionId, token, callback }) => {
    const url = Config.magasin.urls.api.analysisType.getAnalysisTypesForCollection(
      museumId,
      collectionId
    );
    return ajaxGet(url, token, callback).map(({ response }) => response);
  };

Analysis.saveAnalysisEvent = (ajaxPost = simplePost) =>
  ({ museumId, data, token, callback }) => {
    const url = Config.magasin.urls.api.analysis.saveAnalysisEvent(museumId);
    return ajaxPost(url, data, token, callback).map(({ response }) => response);
  };

Analysis.editAnalysisEvent = (ajaxPut = simplePut) =>
  ({ id, museumId, data, token, callback }) => {
    const url = Config.magasin.urls.api.analysis.getAnalysisById(museumId, id);
    return ajaxPut(url, data, token, callback).map(({ response }) => response);
  };

Analysis.getAnalysesForObject = (ajaxGet = simpleGet) =>
  ({ museumId, token, id, callback }) => {
    const url = Config.magasin.urls.api.analysis.analysesForObject(museumId, id);
    return ajaxGet(url, token, callback).map(({ response }) => {
      if (!Array.isArray(response)) {
        return [];
      }
      return response;
    });
  };

Analysis.getAnalysisById = (ajaxGet = simpleGet) =>
  ({ museumId, id, token, callback }) => {
    const url = Config.magasin.urls.api.analysis.getAnalysisById(museumId, id);
    return ajaxGet(url, token, callback).map(({ response }) => response);
  };

Analysis.getAnalysisWithDetails = (ajaxGet = simpleGet) =>
  props => {
    return Analysis.getAnalysisById(ajaxGet)(props)
      .flatMap(analysis =>
        MusitActor.getActor(ajaxGet)({
          token: props.token,
          actorId: analysis.registeredBy
        }).map(actor => actor ? { ...analysis, registeredByName: actor.fn } : analysis))
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
              return od ? { ...e, ...od } : e;
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
  };

export default Analysis;
