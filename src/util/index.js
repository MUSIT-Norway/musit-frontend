/* @flow */
import moment from 'moment';

export const flatten = (arr: []) => {
  const obj = {};

  for (let i = 0; i < arr.length; i++) {
    Object.keys(arr[i]).forEach((x) => {
      obj[x] = arr[i][x];
    });
  }

  return obj;
};

export const blur = () => {
  // Give the document focus
  window.focus();

  // Remove focus from any focused element
  if (document.activeElement) {
    document.activeElement.blur();
  }
};

export const containsObjectWithField = (arr: any[], field: string, value: string): boolean => arr.filter((e) => e[field] === value).length > 0;

export const DATE_FORMAT_DISPLAY = 'DD.MM.YYYY';
export const DATE_FORMAT_ISO_SHORT = 'YYYY-MM-DD';
export const DATE_FORMAT_ISO_FULL = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';

export const parseISODateNonStrict = (dateStr: string) => {
  return moment(dateStr, [DATE_FORMAT_ISO_FULL]);
};

export const parseISODateStrict = (dateStr: string) => {
  return moment(dateStr, [DATE_FORMAT_ISO_SHORT], true);
};

export const parseFloatFromString = (value: string): number => {
  return typeof value === 'string' ? window.parseFloat(value.replace(',', '.')) : value;
};

export const formatFloatToString = (number: number): string => {
  return typeof number === 'number' ? number.toString().replace('.', ',') : number;
};

export const hasProp = (obj: any, prop: string): boolean => {
  return {}.hasOwnProperty.call(obj, prop);
};

export const isDateBiggerThanToday = (newDate: any): boolean => {
  const today = moment();
  const isAfterYear = moment(newDate).isAfter(today, 'year');
  const isAfterMonth = moment(newDate).isAfter(today, 'month');
  const isAfterDay = moment(newDate).isAfter(today, 'day');
  return isAfterDay || isAfterMonth || isAfterYear;
};

export class Option {
  value = null;

  constructor(value: any) {
    this.value = value;
  }

  map<U>(func: (a: any) => U): ?U {
    if (this.value == null) {
      return; // return undefined/void
    }
    return func(this.value);
  }

}

const testing = process.env.NODE_ENV === 'test';

export const apiUrl = (url: string): string => {
  return `${testing ? 'http://localhost' : ''}${url}`;
};
