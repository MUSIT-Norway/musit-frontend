/* @flow */

export type ObjectType = 'collection' | 'sample' | 'node';

export type MovableObject = {
  id: string,
  objectType: ObjectType
};

export const COLLECTION_TYPE: ObjectType = 'collection';
export const SAMPLE_TYPE: ObjectType = 'sample';
export const NODE_TYPE: ObjectType = 'sample';
