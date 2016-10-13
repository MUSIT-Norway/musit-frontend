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

export const createBreadcrumbPath = (pathStr: string, pathNames: PathName[]): BreadCrumb[]  => {
  const pathStrIds = (pathStr != null ? pathStr : '').slice(1, -1).split(',').slice(1).map(p => parseFloat(p));
  return pathStrIds.map(pathId => new BreadCrumb(pathNames.find(e => e.nodeId === pathId)))
}

export const containsObjectWithField = (arr: any[], field: string, value: string): boolean => arr.filter((e) => e[field] === value).length > 0

export const DATE_FORMAT_DISPLAY = 'DD.MM.YYYY'
export const DATE_FORMAT_ISO_SHORT = 'YYYY-MM-DD'
export const DATE_FORMAT_ISO_FULL = 'YYYY-MM-DDTHH:mm:ss.SSSZZ'

export const parseISODateNonStrict = (dateStr: string) => {
  return moment(dateStr, [DATE_FORMAT_ISO_SHORT])
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
