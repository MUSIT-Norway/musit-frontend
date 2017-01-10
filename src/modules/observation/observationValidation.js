import { parseFloatFromString } from '../../util';
import { validateString, validateNumber } from '../../components/formfields/common/validators';

const typeFieldIncorrect = (type, field) => {
  return `musit.observation.page.${type}.${field}Incorrect`;
};

const toSmallerThanFromValue = (type, field) => {
  return `musit.observation.page.${type}.${field}SmallerThanFromValue`;
};

const typeFieldRequired = (type, field) => {
  return `musit.observation.page.${type}.${field}Required`;
};

const validateStringField = (type, field, required = false, maxLength = 100) => {
  return (formProps) => {
    const errors = {};
    if (required && !formProps[field]) {
      errors[`${type}.${field}`] = typeFieldRequired(type, field);
    } else if (formProps[field] && validateString(formProps[field].trim(), 1, maxLength) === 'error') {
      errors[`${type}.${field}`] = typeFieldIncorrect(type, field);
    }
    return errors;
  };
};

export const validateDoubleTextArea = (formProps, index, type) => {
  let errors = {};
  errors = { ...errors, ...validateStringField(type, 'leftValue', true, 100)(formProps) };
  errors = { ...errors, ...validateStringField(type, 'rightValue', false, 250)(formProps) };
  return errors;
};

export const validatePest = (formProps, index, type) => {
  const errors = {};

  if (!formProps.identificationValue) {
    errors[`${type}.identificationValue`] = typeFieldRequired(type, 'identificationValue');
  } else if (validateString(formProps.identificationValue, 1, 100) === 'error') {
    errors[`${type}.identificationValue`] = typeFieldIncorrect(type, 'identificationValue');
  }
  if (validateString(formProps.commentValue, 0, 250) === 'error') {
    errors[`${type}.commentValue`] = typeFieldIncorrect(type, 'commentsValue');
  }

  formProps.observations.forEach((observation) => {
    if (observation.lifeCycle && validateString(observation.lifeCycle, 1) === 'error') {
      errors[`${type}.observations[${index}].observations.lifeCycle`] =
          typeFieldIncorrect(type, 'observations.lifeCycle');
    }
    if (observation.count && validateNumber(observation.count, 0, 10, 0) === 'error') {
      errors[`${type}.observations[${index}].observations.count`] =
          typeFieldIncorrect(type, 'count');
    }
    if (observation.count && !observation.lifeCycle) {
      errors[`${type}.observations[${index}].observations.lifeCycleRequired`] =
          typeFieldRequired(type, 'lifeCycle');
    }
  });

  return errors;
};

export const validateAlcohol = (formProps, index, type) => {
  const errors = {};

  if (!formProps.statusValue) {
    errors[`${type}.statusValue`] = typeFieldRequired(type, 'statusValue');
  } else if (validateString(formProps.statusValue, 1) === 'error') {
    errors[`${type}.statusValue`] = typeFieldIncorrect(type, 'statusValue');
  }

  if (formProps.volumeValue && validateNumber(formProps.volumeValue, 0, 10, 3) === 'error') {
    errors[`${type}.volumeValue`] = typeFieldIncorrect(type, 'volumeValue');
  }

  if (formProps.commentValue && validateString(formProps.commentValue, 1, 250) === 'error') {
    errors[`${type}.commentValue`] = typeFieldIncorrect(type, 'commentValue');
  }

  return errors;
};

export const validateFromTo = (formProps, index, type) => {
  const errors = {};

  if (!formProps.fromValue) {
    errors[`${type}.fromValue`] = typeFieldRequired(type, 'fromValue');
  } else if (validateNumber(formProps.fromValue, 0, 10, 3) === 'error') {
    errors[`${type}.fromValue`] = typeFieldIncorrect(type, 'fromValue');
  }

  if (formProps.toValue && validateNumber(formProps.toValue, 0, 10, 3) === 'error') {
    errors[`${type}.toValue`] = typeFieldIncorrect(type, 'toValue');
  }

  if (formProps.commentValue && validateString(formProps.commentValue, 1, 250) === 'error') {
    errors[`${type}.commentValue`] = typeFieldIncorrect(type, 'commentsValue');
  }

  if (formProps.toValue && formProps.fromValue) {
    const fromValue = parseFloatFromString(formProps.fromValue);
    const toValue = parseFloatFromString(formProps.toValue);
    if (fromValue > toValue) {
      errors[`${type}.toValue`] = toSmallerThanFromValue(type, 'toValue');
    }
  }


  return errors;
};
