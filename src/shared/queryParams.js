// @flow

import isUndefined from 'lodash/isUndefined';
import reduce from 'lodash/reduce';
import join from 'lodash/join';

const encodeValue = value => encodeURIComponent(value.toString());

/**
 * Create a url safe query param string from an object. Undefined and null
 * values will be ignored (including the key).
 */
export default (queryParamObj: {
  [string]: ?string | ?number | ?Array<string | number>
}): string => {
  const encQueryParams = reduce(
    queryParamObj,
    (result, value, key): Array<string> => {
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
