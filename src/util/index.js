import moment from 'moment'

export const DATE_FORMAT_DISPLAY = 'DD.MM.YYYY'
export const DATE_FORMAT_ISO = 'YYYY-MM-DD'

export const flatten = (arr) => {
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

export const isDefined = (o) => o !== null && typeof o !== 'undefined'

export const containsObjectWithField = (arr, field, value) => arr.filter((e) => e[field] === value).length > 0

export const camelCase = (string, separator) => {
  return string
    .split(separator)
    .map((word, index) =>
      word.substr(0, 1)[index === 0 ? 'toUpperCase' : 'toLowerCase']() + word.substr(1)
    ).join('');
}

export const parseISODateNonStrict = (dateStr) => {
  return moment(dateStr, [DATE_FORMAT_ISO])
}

export const parseISODateStrict = (dateStr) => {
  return moment(dateStr, [DATE_FORMAT_ISO], true)
}
