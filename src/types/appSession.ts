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
  language: Language,
  rolesForModules: {
    collectionManagementRead: boolean,
    collectionManagementWrite: boolean,
    storageFacilityRead: boolean,
    storageFacilityWrite: boolean,
    storageFacilityAdmin: boolean,
    documentArchiveRead: boolean,
    documentArchiveWrite: boolean
  }
};
