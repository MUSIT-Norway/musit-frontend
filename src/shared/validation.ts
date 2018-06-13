import { Maybe } from '../types/common';

export const validKeysForNumberRange = (key: string): boolean => {
  const validKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
  if (validKeys.indexOf(key) < 0) return false;
  else return true;
};

export const removeInvalidKeysForNumberRange = (key: string): Maybe<string> =>
  key && validKeysForNumberRange(key) ? key : '';

export const removeInvalidKeysForNumberRangeString = (input: string): Maybe<string> =>
  input
    ? input
        .split('')
        .filter(s => validKeysForNumberRange(s))
        .join('')
    : '';

export const validateNumberRangeField = (input: string): boolean => {
  const re = /^(\d*)(\.\.)?(\d*)$/;
  return input ? re.test(input) : true;
};
