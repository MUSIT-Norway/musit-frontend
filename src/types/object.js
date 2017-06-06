// @flow

export type ObjectData = {
  id: number,
  nodeId: string,
  mainObjectId: number,
  uuid: string,
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

export type objectTypeAndId = Array<{ objectType: 'collection' | 'sample', id: string }>;
