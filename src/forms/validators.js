import * as revalidate from 'revalidate';

export const isNumberInRange = (from: number, to: number) => revalidate.createValidator(
  (message: string) => (value: number) => {
    if (!(value >= from && value <= to)) {
      return message;
    }
  },
  (field: string) => field + ' must be a number in range ' + from + ' / ' + to
);

export const isNumber = (minPrecision = 0, maxPrecision = Number.MAX_SAFE_INTEGER) => revalidate.createValidator(
  message => value => {
    const regex = new RegExp('^-?\\d+,?\\d{' + minPrecision + ',' + maxPrecision + '}$');
    if (!regex.test(value)) {
      return message;
    }
  },
  (field: string) => field + ' must be a decimal number'
);

export const isRequired = revalidate.createValidator(
  message => value => {
    if (value == null || (typeof value === 'string' && value.trim() === '')) {
      return message;
    }
  },
  (field: string) => `${field} is required`
);

export const noValidation = {
  rawValidator: () => () => null,
  valueValidator: () => () => null
};

export const composeValidators = revalidate.composeValidators;