/* @flow */
import moment from 'moment'

export const flatten = (arr: any[]) => {
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

export const createBreadcrumbPath = (pathStr: string, pathNames: any[]): any[]  => {
  const pathIds = pathStr.slice(1, -1).split(',').slice(1)
  const r = pathIds.map((i) => (pathNames.find(e => e.nodeId === parseFloat(i))))
  return r.map(e => {
    if (e) {
      return { id: e.nodeId, name: e.name, url: `/magasin/${e.nodeId}`}
    }
    return e
  })
}

export const containsObjectWithField = (arr: any[], field: string, value: string): boolean => arr.filter((e) => e[field] === value).length > 0

export const DATE_FORMAT_DISPLAY = 'DD.MM.YYYY'
export const DATE_FORMAT_ISO_SHORT = 'YYYY-MM-DD'
export const DATE_FORMAT_ISO_FULL = 'YYYY-MM-DDTHH:mm:ss.SSSZZ'

export const parseISODateNonStrict = (dateStr: string): any => {
  return moment(dateStr, [DATE_FORMAT_ISO_SHORT])
}

export const parseISODateStrict = (dateStr: string): any => {
  return moment(dateStr, [DATE_FORMAT_ISO_SHORT], true)
}

export const parseFloatFromString = (value: string): any => {
  return typeof value === 'string' ? window.parseFloat(value.replace(',', '.')) : value
}

export const formatFloatToString = (number: number): string => {
  return typeof number === 'number' ? number.toString().replace('.', ',') : number
}

export const hasProp = (obj: any, prop: string): boolean => {
  return {}.hasOwnProperty.call(obj, prop)
}
