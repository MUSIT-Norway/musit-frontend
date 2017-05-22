import * as revalidate from 'revalidate';

export const isNumberInRange = (from: number, to: number) =>
  revalidate.createValidator(
    (message: string) => (value: number) => {
      if (!(value >= from && value <= to)) {
        return message;
      }
    },
    (field: string) => field + ' must be a number in range ' + from + ' / ' + to
  );

export const isNumber = (minPrecision = 0, maxPrecision = Number.MAX_SAFE_INTEGER) =>
  revalidate.createValidator(
    message => value => {
      const regex = new RegExp(
        '^-?\\d+,?\\d{' + minPrecision + ',' + maxPrecision + '}$'
      );
      if (!regex.test(value)) {
        return message;
      }
    },
    (field: string) => field + ' must be a decimal number'
  );

export const isNonEmptyArray = revalidate.createValidator(
  message => value => {
    if (value && value.length === 0) {
      return message;
    }
  },
  (field: string) => `${field} must be a non-empty array`
);

export const isRequired = revalidate.createValidator(
  message => value => {
    if (value == null || (typeof value === 'string' && value.trim() === '')) {
      return message;
    }
  },
  (field: string) => `${field} is required`
);

export const isSpecialPhone = revalidate.createValidator(
  message => value => {
    if (value) {
      const parts = value.split('-');
      if (parts.length !== 2 || !(/^\d{2}$/.test(parts[0]) && /^\d{2}$/.test(parts[1]))) {
        return message;
      }
    }
  },
  (field: string) => `${field} is not a phone`
);

export const noValidation = {
  rawValidator: () => () => null,
  valueValidator: () => () => null
};

export const composeValidators = revalidate.composeValidators;
