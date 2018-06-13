// @flow

import { join, reduce, isUndefined } from 'lodash';
import { Maybe, MUSTFIX, TODO } from '../types/common';

const encodeValue = (value: TODO) => encodeURIComponent(value.toString());

/**
 * Create a url safe query param string from an object. Undefined and null
 * values will be ignored (including the key).
 */
export default (queryParamObj: {
  [key: string]:
    | Maybe<string>
    | Maybe<number>
    | Maybe<Array<string | number>>
    | Maybe<boolean>;
}): string => {
  const encQueryParams = reduce(
    queryParamObj,
    (result: MUSTFIX, value, key): Array<string> => {
      if (value === null || isUndefined(value)) {
        return result;
      } else {
        const encVal = Array.isArray(value)
          ? join(value.map(encodeValue), ',')
          : encodeValue(value);
        result.push(key + '=' + encVal);
        return result;
      }
    },
    []
  );

  if (encQueryParams.length === 0) {
    return '';
  } else {
    return '?' + join(encQueryParams, '&');
  }
};
