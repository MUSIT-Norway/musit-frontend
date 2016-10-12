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
  return pathStr.slice(1, -1).split(',').slice(1).map(pathId => new BreadCrumb(pathNames.find(e => e.nodeId === parseFloat(pathId))))
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

export const isDateBiggerThanToday = (newDate: any): boolean => {
  if (newDate) {
    // uses YYYY/MM/DD format to make string comparison right 
    return (moment().format('YYYY/MM/DD') < moment(newDate).format('YYYY/MM/DD')) ? true : false
  } else {
    return false
  }
}
