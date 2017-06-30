// @flow

import type { ActorId } from './ids';

export type Actor = {
  dataportenId?: ?string,
  applicationId?: ?string,
  fn: string
};

/**
 * This is the actual response object from the backend.
 */
export type ActorStamp = {
  user: ActorId,
  date: string
};
