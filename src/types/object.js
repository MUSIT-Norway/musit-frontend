/* @flow */

export type ObjectData = {
  objectId: number,
  objectUUID: string,
  objectType: string,
  subNo: string,
  term: string,
  museumNo: string
};

export type ObjectProps = {
  id: number,
  museumId: {},
  collectionId: {},
  token: string,
  callBack: any
};
