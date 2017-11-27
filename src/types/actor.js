// @flow

import type { ActorId } from './ids';

export type Actor = {
  dataportenId?: ?string,
  applicationId?: ?string,
  fn: string
};

export type ActorRoleDate = {
  actorId: string,
  roleId: string,
  date: string
};

/**
 * This is the actual response object from the backend.
 */
export type ActorStamp = {
  user: ActorId,
  date: string
};
