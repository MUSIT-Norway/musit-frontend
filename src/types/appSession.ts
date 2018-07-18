// @flow

import { Actor } from './actor';
import { Uuid } from './common';

export type Language = {
  isEn: boolean;
  isNo: boolean;
};

interface BuildInfo {
  commitSha: string; //Eksempel: '813e993f1d1bdaa7b60daa66d75e1957de4c6e2b'
}

interface Collection {
  uuid: Uuid;
  name: string;
}
export interface Group {
  id: number;
  shortName: string;
  museumId: number;
  museumName: string;
  permission: number;
  collections: Array<Collection>;
}

export interface AppSession {
  museumId: number;
  collectionId: string;
  accessToken: string;
  actor: Actor;
  language: Language;
  rolesForModules: {
    collectionManagementRead: boolean;
    collectionManagementWrite: boolean;
    storageFacilityRead: boolean;
    storageFacilityWrite: boolean;
    storageFacilityAdmin: boolean;
    documentArchiveRead: boolean;
    documentArchiveWrite: boolean;
  };
  buildInfo?: BuildInfo;
  groups: Array<Group>;
  isGod?: boolean;
}
