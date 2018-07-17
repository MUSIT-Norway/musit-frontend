// @flow
import { ConservationCollection } from '../../../types/conservation';
import { Maybe } from '../../../types/common';

export type Store = {
  conservation?: Maybe<ConservationCollection>;
};
