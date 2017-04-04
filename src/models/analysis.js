import {simpleGet, simplePost} from '../shared/RxAjax';
import Config from '../config';
import entries from 'object.entries';
import orderBy from 'lodash/orderBy';
import MusitActor from './actor';
import MusitObject from './object';
import {Observable} from 'rxjs';

class Analysis {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Analysis.getAnalysisTypesForCollection = (ajaxGet = simpleGet) => ({museumId, collectionId, token, callback}) => {
  const url = Config.magasin.urls.api.analysisType.getAnalysisTypesForCollection(museumId, collectionId);
  return ajaxGet(url, token, callback).map(({response}) => response);
};

Analysis.getAllAnalysisTypes = (ajaxGet = simpleGet) => ({museumId, token, callback}) => {
  return ajaxGet(`${Config.magasin.urls.api.analysisType.getAllAnalysisTypes(museumId)}`, token, callback)
    .map(({response}) => orderBy(response, ['name'], ['asc']));
};

Analysis.saveAnalysisEvent = (ajaxPost = simplePost) => ({museumId, data, token, callback}) => {
  const url = Config.magasin.urls.api.analysis.saveAnalysisEvent(museumId);
  return ajaxPost(url, data, token, callback).map(({response}) => response && new Analysis(response));
};

Analysis.getAnalysesForObject = (ajaxGet = simpleGet) => ({museumId, token, id, callback}) => {
  const url = Config.magasin.urls.api.analysis.analysesForObject(museumId, id);
  return ajaxGet(url, token, callback).map(({response}) => response);
};

Analysis.getAnalysisById = (ajaxGet = simpleGet) => ({museumId, id, token, callback}) => {
  const url = Config.magasin.urls.api.analysis.getAnalysisById(museumId, id);
  return ajaxGet(url, token, callback).map((analysis) => analysis.response);
};

Analysis.getAnalysisWithDeatils = (ajaxGet = simpleGet) => (props) => {
  return Analysis.getAnalysisById(ajaxGet)(props)
    .flatMap(analysis =>
      MusitActor.getActor(ajaxGet)({token: props.token, actorId: analysis.registeredBy})
        .map(actor => {
          if (!actor) {
            return analysis;
          }
          return {...analysis, registeredByName: actor.fn};
        })
    ).flatMap(analysis => {
      if (analysis.type === 'AnalysisCollection') {
        return Observable.forkJoin(analysis.events.map(a => {
          return MusitObject.getObjectDetails(ajaxGet)({
            id: a.objectId,
            museumId: props.museumId,
            collectionId: props.collectionId,
            token: props.token
          });
        })).map(arrayOfObjectDetails => {
          const actualValues = arrayOfObjectDetails.filter(a => a);
          if (actualValues.length === 0) {
            return analysis;
          }
          return {
            ...analysis, events: analysis.events.map(e => {
              const od = arrayOfObjectDetails.find(objD => objD.uuid === e.objectId);
              if (!od) {
                return e;
              }
              return {...e, ...od};
            })
          };
        });
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
        return {...analysis, museumNo: object.museumNo, subNo: object.subNo, term: object.term};
      });
    }
    );
};

export default Analysis;
