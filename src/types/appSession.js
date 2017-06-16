// @flow

import type { Actor } from './actor';

export type Language = {
  isEn: boolean,
  isNo: boolean
};

export type AppSession = {
  museumId: number,
  collectionId: string,
  accessToken: string,
  actor: Actor,
  language: Language
};
