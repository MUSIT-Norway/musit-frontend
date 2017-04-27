/* @flow */

import type { Actor } from './actor';

export type AppSession = {
  museumId: number,
  collectionId: string,
  accessToken: string,
  actor: Actor
};
