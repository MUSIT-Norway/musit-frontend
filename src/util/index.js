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

export const getCurrentDate = () => {
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; // January is 0!
  const yyyy = today.getFullYear();

  if (dd < 10) {
    dd = `0${dd}`
  }

  if (mm < 10) {
    mm = `0${mm}`
  }

  return `${yyyy}-${mm}-${dd}`
}