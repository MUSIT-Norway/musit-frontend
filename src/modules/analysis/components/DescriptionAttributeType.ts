import { Maybe } from '../../../types/common';

// @flow
export type DescriptionAttributeType = {
  attributeKey: string;
  attributeType: string;
  allowedValues?: Maybe<Array<{ id: number; enLabel: string; noLabel: string }>>;
};
