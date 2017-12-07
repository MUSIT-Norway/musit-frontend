// @flow
import { Observable } from 'rxjs';
import Config from '../../config';
import { simplePost, simplePut, ajaxHelper } from '../../shared/RxAjax';
import type { Callback, AjaxPut, AjaxPost } from '../../types/ajax';

export type SavedFile = {
  id: string,
  fid: string,
  title: string,
  fileType: string,
  owner: { ownerId: string, ownerType: string },
  collection: string,
  path: string,
  version: number,
  published: boolean,
  createdStamp: { date: string, by: string },
  documentDetails: { number: number }
};

export type ErrorSaving = {
  error: { status: number, response?: any },
  file: File
};

export const addResultFile: (props: {
  eventId: number,
  museumId: number,
  collectionId: string,
  token: string,
  file: File
}) => Observable<SavedFile | ErrorSaving> = props => {
  const formData: FormData = new FormData();
  formData.append('upload', props.file, props.file.name);
  return ajaxHelper(
    Config.magasin.urls.api.conservation.addFileUrl(
      props.museumId,
      props.collectionId,
      props.eventId
    ),
    'POST',
    formData,
    props.token
  )
    .map((res: { status: number, response: any }) => {
      if (res.status >= 200 && res.status < 300) {
        return res.response;
      }
      return {
        error: res.response || res,
        file: props.file
      };
    })
    .catch(error =>
      Observable.of({
        error: error,
        file: props.file
      })
    );
};

export type ErrorLoading = {
  error: { status: number, response?: any },
  files: Array<string>
};

export const getFiles = (props: {
  files: Array<string>,
  museumId: number,
  token: string,
  eventId: number
}): Observable<Array<SavedFile | ErrorLoading>> => {
  if (props.files.length === 0) {
    return Observable.of([]);
  }
  if (props.files.length > 1) {
    return Observable.forkJoin(
      // $FlowFixMe
      props.files.map(file =>
        ajaxHelper(
          Config.magasin.urls.api.attachments.getFilesUrl(
            [file],
            props.museumId,
            props.eventId
          ),
          'GET',
          null,
          props.token
        )
          .map((res: { status: number, response: any }) => {
            if (res.status >= 200 && res.status < 300) {
              return res.response ? res.response[0] : res.response;
            }
            return {
              error: res.response || res,
              files: [file]
            };
          })
          .catch(error =>
            Observable.of({
              error: error,
              files: [file]
            })
          )
      )
    );
  }
  return ajaxHelper(
    Config.magasin.urls.api.attachments.getFilesUrl(
      props.files,
      props.museumId,
      props.eventId
    ),
    'GET',
    null,
    props.token
  )
    .map((res: { status: number, response: any }) => {
      if (res.status >= 200 && res.status < 300) {
        return res.response ? res.response[0] : res.response;
      }
      return {
        error: res.response || res,
        files: props.files
      };
    })
    .catch(error =>
      Observable.of({
        error: error,
        files: props.files
      })
    )
    .map(v => [v]);
};

export type ErrorDownloading = {
  error: { status: number, response?: any },
  fileId: string
};

export const getFileAsBlob = (
  fileId: string,
  museumId: number,
  token: string
): Observable<Blob | ErrorDownloading> => {
  return ajaxHelper(
    Config.magasin.urls.api.attachments.getFileUrl(fileId, museumId),
    'GET',
    null,
    token,
    null,
    'blob'
  )
    .map((res: { status: number, response: any }) => {
      if (res.status >= 200 && res.status < 300) {
        return res.response;
      }
      return {
        error: res.response || res,
        fileId: fileId
      };
    })
    .catch(error =>
      Observable.of({
        error: error,
        fileId: fileId
      })
    );
};
