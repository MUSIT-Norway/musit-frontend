/* @flow */
import moment from 'moment'

export const flatten = (arr: []) => {
  const obj = {};

  for (let i = 0; i < arr.length; i++) {
    Object.keys(arr[i]).forEach((x) => {
      obj[x] = arr[i][x]
    })
  }

  return obj
}

export const blur = () => {
  // Give the document focus
  window.focus();

  // Remove focus from any focused element
  if (document.activeElement) {
    document.activeElement.blur();
  }
}

class PathName {
  nodeId: number;
  name: string;

  constructor(nodeId: number, name: string) {
    this.nodeId = nodeId
    this.name = name;
  }
}

class BreadCrumb {
  id: number;
  name: string;
  url: string;

  constructor(pathName: ?PathName) {
    if (pathName) {
      this.id = pathName.nodeId;
      this.name = pathName.name;
      this.url = '/magasin/' + pathName.nodeId;
    }
  }
}

export const createBreadcrumbPath = (pathStr: string, pathNames: PathName[]): BreadCrumb[] => {
  const pathStrIds = (pathStr != null ? pathStr : '').slice(1, -1).split(',').slice(1).map(p => parseFloat(p));
  return pathStrIds.map(pathId => new BreadCrumb(pathNames.find(e => e.nodeId === pathId)))
}

export const containsObjectWithField = (arr: any[], field: string, value: string): boolean => arr.filter((e) => e[field] === value).length > 0

export const DATE_FORMAT_DISPLAY = 'DD.MM.YYYY'
export const DATE_FORMAT_ISO_SHORT = 'YYYY-MM-DD'
export const DATE_FORMAT_ISO_FULL = 'YYYY-MM-DDTHH:mm:ss.SSSZZ'

export const parseISODateNonStrict = (dateStr: string) => {
  return moment(dateStr, [DATE_FORMAT_ISO_FULL])
}

export const parseISODateStrict = (dateStr: string) => {
  return moment(dateStr, [DATE_FORMAT_ISO_SHORT], true)
}

export const parseFloatFromString = (value: string): number => {
  return typeof value === 'string' ? window.parseFloat(value.replace(',', '.')) : value
}

export const formatFloatToString = (number: number): string => {
  return typeof number === 'number' ? number.toString().replace('.', ',') : number
}

export const hasProp = (obj: any, prop: string): boolean => {
  return {}.hasOwnProperty.call(obj, prop)
}

export const isDateBiggerThanToday = (newDate: any): boolean => {
  const today = moment()
  const isAfterYear = moment(newDate).isAfter(today, 'year')
  const isAfterMonth = moment(newDate).isAfter(today, 'month')
  const isAfterDay = moment(newDate).isAfter(today, 'day')
  return isAfterDay || isAfterMonth || isAfterYear
}

export class Option {
  value = null;

  constructor(value: any) {
    this.value = value;
  }

  map<U>(func: (a: any) => U): ?U {
    if (this.value == null) {
      return; // return undefined/void
    }
    return func(this.value)
  }

}

const testing = process.env.NODE_ENV === 'test';

export const apiUrl = (url: string): string => {
  return `${testing ? 'http://localhost' : ''}${url}`;
}

export const sortObject = (obj: any, key: string, inputKeyType: string = '', sortAscending: bool = true, keyChild: string): any => {
  function valueLowerCase(v) {
    try {
      return v && v !== '' && typeof v === 'string' ? v.toLowerCase() : v
    } catch (err) {
      throw err
    }
  }
  function compare(a, b) {
    try {
      if (keyChild) {
        a = a[key][keyChild] ? a[key][keyChild] : ''
        b = b[key][keyChild] ? b[key][keyChild] : ''
      } else {
        a = a[key] ? a[key] : ''
        b = b[key] ? b[key] : ''
      }

      let type = typeof a === 'string' || typeof b === 'string' ? 'string' : 'number'
      type = inputKeyType ? inputKeyType : type

      let result
      if (type === 'string') {
        if (sortAscending) {
          result = valueLowerCase(a) > valueLowerCase(b)
        } else {
          result = valueLowerCase(b) > valueLowerCase(a)
        }}
      else result = sortAscending ? a - b : b - a
      return result;
    } catch (err) {
       throw err
    }
  }

  return obj && JSON.stringify(obj) !== '{}' ? [].slice.call(obj).sort(compare) : {}

}
