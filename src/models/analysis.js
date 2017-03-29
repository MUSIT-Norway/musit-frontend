import {simpleGet, simplePost} from '../shared/RxAjax';
import Config from '../config';
import entries from 'object.entries';
import orderBy from 'lodash/orderBy';
import MusitActor from './actor';

class Analysis {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

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
  const url = `${Config.magasin.urls.api.analysis.getAnalysisById(museumId, id)}`;
  return ajaxGet(url, token, callback)
    .map((analysis) => analysis.response);
};

Analysis.getAnalysisTypeById = (ajaxGet = simpleGet) => ({museumId, id, token, callback}) => {
  return ajaxGet(`${Config.magasin.urls.api.analysisType.getAnalysisTypeById(museumId, id)}`, token, callback)
    .map(({response}) => response);
};

Analysis.getAnalysisByIdWithName = (ajaxGet = simpleGet) => (props) => {
  return Analysis.getAnalysisById(ajaxGet)(props)
    .flatMap(analysis =>
      MusitActor.getActor(ajaxGet)({token: props.token, actorId: analysis.registeredBy})
        .map(actor => {
          if (!actor) {
            return analysis;
          }
          return {...analysis, registeredByName: actor.fn};
        })
    );
};

export default Analysis;
