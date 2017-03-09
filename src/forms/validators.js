import { createValidator } from 'revalidate';

export const isNumberInRange = (from, to) => createValidator(
  message => value => {
    if (value && !(value >= from && value <= to)) {
      return message;
    }
  },
  field => field + ' must be a number in range ' + from + ' - ' + to
);

export const isDecimalNumber = (minPrecision = 0, maxPrecision = Number.MAX_SAFE_INTEGER) => createValidator(
  message => value => {
    const regex = new RegExp('^-?\\d+,?\\d{' + minPrecision + ',' + maxPrecision + '}$');
    if (!regex.test(value)) {
      return message;
    }
  },
  field => field + ' must be a decimal number'
);

export const noValidation = {
  rawValidator: () => () => null,
  valueValidator: () => () => null
};