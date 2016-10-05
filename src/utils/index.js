import moment from 'moment'

export const flatten = (arr) => {
  const obj = {}

  for (let i = 0; i < arr.length; i++) {
    Object.keys(arr[i]).forEach((x) => {
      obj[x] = arr[i][x]
    })
  }

  return obj
}

export const blur = () => {
  // Give the document focus
  window.focus()

  // Remove focus from any focused element
  if (document.activeElement) {
    document.activeElement.blur()
  }
}

export const containsObjectWithField = (arr, field, value) => arr.filter((e) => e[field] === value).length > 0

export const DATE_FORMAT_DISPLAY = 'DD.MM.YYYY'
export const DATE_FORMAT_ISO_SHORT = 'YYYY-MM-DD'
export const DATE_FORMAT_ISO_FULL = 'YYYY-MM-DDTHH:mm:ss.SSSZZ'

export const parseISODateNonStrict = (dateStr) => {
  return moment(dateStr, [DATE_FORMAT_ISO_SHORT])
}

export const parseISODateStrict = (dateStr) => {
  return moment(dateStr, [DATE_FORMAT_ISO_SHORT], true)
}

export const parseFloatFromString = (value) => {
  return typeof value === 'string' ? window.parseFloat(value.replace(',', '.')) : value
}

export const formatFloatToString = (number) => {
  return typeof number === 'number' ? number.toString().replace('.', ',') : number
}

export const hasProp = (obj, prop) => {
  return {}.hasOwnProperty.call(obj, prop)
}
