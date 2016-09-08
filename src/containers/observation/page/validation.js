import { validateString, validateNumber } from '../../../components/formfields/common/validators'

const typeFieldIncorrect = (type, field) => {
  return `musit.observation.page.${type}.${field}Incorrect`
}

const typeFieldRequired = (type, field) => {
  return `musit.observation.page.${type}.${field}Required`
}

const validateStringField = (type, field, required = false, maxLength = 100) => {
  return (formProps) => {
    const errors = {}
    if (required && !formProps[field]) {
      errors[`${type}.${field}`] = typeFieldRequired(type, field)
    } else if (formProps[field] && validateString(formProps[field].trim(), 1, maxLength) === 'error') {
      errors[`${type}.${field}`] = typeFieldIncorrect(type, field)
    }
    return errors
  }
}

export const validateDoubleTextArea = (formProps, index, type) => {
  let errors = {}
  errors = { ...errors, ...validateStringField(type, 'leftValue', true, 100)(formProps) }
  errors = { ...errors, ...validateStringField(type, 'rightValue', false, 250)(formProps) }
  return errors
}

export const validatePest = (formProps, index, type) => {
  const errors = {}

  if (!formProps.identificationValue) {
    errors[`${type}.identificationValue`] = typeFieldRequired(type, 'identificationValue')
  }

  if (validateString(formProps.commentValue, 0, 250) === 'error') {
    errors[`${type}.commentValue`] = typeFieldIncorrect(type, 'commentsValue')
  }

  formProps.observations.forEach((observation) => {
    if (observation.lifeCycle && validateString(observation.lifeCycle, 1) === 'error') {
      errors[`${type}.observations[${index}].observations.lifeCycle`] =
          typeFieldIncorrect(type, 'observations.lifeCycle')
    }
    if (observation.count && validateNumber(observation.count, 0, 10, 0) === 'error') {
      errors[`${type}.observations[${index}].observations.count`] =
          typeFieldIncorrect(type, 'count')
    }
    if (observation.count && !observation.lifeCycle) {
      errors[`${type}.observations[${index}].observations.lifeCycleRequired`] =
          typeFieldRequired(type, 'lifeCycle')
    }
  })

  return errors
}

export const validateAlcohol = (formProps, index, type) => {
  const errors = {}

  if (!formProps.status) {
    errors[`${type}.status`] = typeFieldRequired(type, 'status')
  } else if (validateString(formProps.status, 1) === 'error') {
    errors[`${type}.status`] = typeFieldIncorrect(type, 'status')
  }

  if (formProps.volume && validateNumber(formProps.volume, 0, 10, 3) === 'error') {
    errors[`${type}.volume`] = typeFieldIncorrect(type, 'volume')
  }

  if (formProps.comment && validateString(formProps.comment, 1, 250) === 'error') {
    errors[`${type}.comment`] = typeFieldIncorrect(type, 'comment')
  }

  return errors;
}

export const validateFromTo = (formProps, index, type) => {
  const errors = {}

  if (!formProps.fromValue) {
    errors[`${type}.fromValue`] = typeFieldRequired(type, 'fromValue')
  } else if (validateString(formProps.fromValue, 1) === 'error') {
    errors[`${type}.fromValue`] = typeFieldIncorrect(type, 'fromValue')
  }

  if (formProps.toValue && validateNumber(formProps.toValue, 0, 10, 3) === 'error') {
    errors[`${type}.toValue`] = typeFieldIncorrect(type, 'toValue')
  }

  if (formProps.commentValue && validateString(formProps.commentValue, 1, 250) === 'error') {
    errors[`${type}.commentValue`] = typeFieldIncorrect(type, 'commentsValue')
  }

  return errors;
}
