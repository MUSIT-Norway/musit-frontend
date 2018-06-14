// @flow

import { ActorId } from './ids';
import { Maybe } from './common';

export type Actor = {
  dataportenId?: Maybe<string>;
  applicationId?: Maybe<string>;
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
