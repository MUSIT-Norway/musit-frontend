// @flow

import { ActorId } from './ids';

export type Actor = {
  dataportenId?: string;
  applicationId?: string;
  dataportenUser?: string;
  fn: string;
};

export type ActorRoleDate = {
  actorId: string;
  roleId: string;
  date: string;
};

/**
 * This is the actual response object from the backend.
 */
export type ActorStamp = {
  user: ActorId;
  date: string;
};
