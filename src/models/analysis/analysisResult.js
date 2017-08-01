// @flow
import { Observable } from 'rxjs';
import Config from '../../config';
import { simplePost, simplePut } from '../../shared/RxAjax';
import type { Callback, AjaxPost } from '../types/ajax';
import type { ImportAnalysisResult } from 'types/analysisResult';

type AnalysisResultSavePayload = {
  extRef?: ?Array<string>,
  comment?: ?string
};

export const addResult: (
  ajaxPost: AjaxPost
) => (props: {
  analysisId: number,
  museumId: number,
  token: string,
  result: ?AnalysisResultSavePayload,
  callback?: Callback
}) => Observable = (ajaxPost = simplePost) => ({
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

export const importResult: (
  ajaxPost: AjaxPost
) => (props: {
  analysisId: number,
  museumId: number,
  token: string,
  result: ImportAnalysisResult
}) => Observable = (ajaxPut = simplePut) => ({ analysisId, museumId, token, result }) =>
  ajaxPut(
    Config.magasin.urls.api.analysis.importResults(museumId, analysisId),
    result,
    token
  );
