import { I18n } from 'react-i18nify'
import { validateString, validateNumber } from '../../../components/formfields/common/validators'

const errorAddMessage = (errors, field) => {
  errors[`${field}`] = I18n.t(`musit.storageUnits.${field}.incorrect`)
}

const validateStringField = (field, value, maxLength = 100) => {
  const errors = {}
  if (validateString(value, 0, maxLength) === 'error') {
    errorAddMessage(errors, field)
  }
  return errors
}

const validateNumberField = (field, value = '', minimumLength = 0, maximumLength = 10, precision = 3) => {
  const errors = {}
  if (validateNumber(value, minimumLength, maximumLength, precision) === 'error') {
    errorAddMessage(errors, field)
  }
  return errors
}

const validateEnvironmentRequirement = (field, min, max, pres, formProps) => {
  const key = field.split('.').reduce((a, b) => formProps[a][b])
  return validateNumberField(field, key, min, max, pres)
}

export default (formProps) => {
  let errors = {}
  if (formProps && formProps.unit) {
    if (!formProps.unit.type || formProps.unit.type.trim().length === 0) {
      errors.type = I18n.t('musit.storageUnits.type.required')
    }
    if (!formProps.unit.name || formProps.unit.name.trim().length === 0) {
      errors.name = I18n.t('musit.storageUnits.name.required')
    }
    errors = { ...errors, ...validateStringField('type', formProps.unit.type, 100) }
    errors = { ...errors, ...validateStringField('name', formProps.unit.name, 100) }
    errors = { ...errors, ...validateStringField('address', formProps.unit.address, 100) }
    errors = { ...errors, ...validateNumberField('area', formProps.unit.area, 0, 10, 3) }
    errors = { ...errors, ...validateNumberField('areaTo', formProps.unit.areaTo, 0, 10, 3) }
    errors = { ...errors, ...validateNumberField('height', formProps.unit.height, 0, 10, 3) }
    errors = { ...errors, ...validateNumberField('heightTo', formProps.unit.heightTo, 0, 10, 3) }
    errors = {
      ...errors,
      ...validateEnvironmentRequirement('environmentRequirement.temperature', 0, 10, 3, formProps.unit)
    }
    errors = {
      ...errors,
      ...validateEnvironmentRequirement('environmentRequirement.temperatureTolerance', 0, 10, 0, formProps.unit)
    }
    errors = {
      ...errors,
      ...validateEnvironmentRequirement('environmentRequirement.relativeHumidity', 0, 10, 3, formProps.unit)
    }
    errors = {
      ...errors,
      ...validateEnvironmentRequirement('environmentRequirement.relativeHumidityTolerance', 0, 10, 0, formProps.unit)
    }
    errors = {
      ...errors,
      ...validateEnvironmentRequirement('environmentRequirement.hypoxicAir', 0, 10, 3, formProps.unit)
    }
    errors = {
      ...errors,
      ...validateEnvironmentRequirement('environmentRequirement.hypoxicAirTolerance', 0, 10, 0, formProps.unit)
    }
    const environmentRequirement = formProps.unit.environmentRequirement;
    errors = {
      ...errors,
      ...validateStringField('environmentRequirement.cleaning', environmentRequirement.cleaning, 100)
    }
    errors = {
      ...errors,
      ...validateStringField('environmentRequirement.lightingCondition', environmentRequirement.lightingCondition, 100)
    }
    errors = {
      ...errors,
      ...validateStringField('environmentRequirement.comments', environmentRequirement.comments, 250)
    }
  } else {
    errors.type = I18n.t('musit.storageUnits.type.required')
    errors.name = I18n.t('musit.storageUnits.name.required')
  }
  return errors
}