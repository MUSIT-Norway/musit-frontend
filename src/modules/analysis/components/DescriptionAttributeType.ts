// @flow
export type DescriptionAttributeType = {
  attributeKey: string,
  attributeType: string,
  allowedValues?: ?Array<{ id: number, enLabel: string, noLabel: string }>
};
