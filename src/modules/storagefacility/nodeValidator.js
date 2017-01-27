import { I18n } from 'react-i18nify';
import { validateString, validateNumber } from '../../components/formfields/common/validators';
import MusitNode from '../../models/node';

const errorAddMessage = (errors, field) => {
  errors[`${field}`] = I18n.t(`musit.storageUnits.${field}.incorrect`);
};

const validateStringField = (field, value, maxLength = 100) => {
  const errors = {};
  if (validateString(value, 0, maxLength) === 'error') {
    errorAddMessage(errors, field);
  }
  return errors;
};

const validateNumberField = (field, value = '', minimumLength = 0, maximumLength = 10, precision = 3) => {
  const errors = {};
  if (validateNumber(value, minimumLength, maximumLength, precision) === 'error') {
    errorAddMessage(errors, field);
  }
  return errors;
};

const validateEnvReq = (field, min, max, pres, formProps) => {
  const key = field.split('.').reduce((a, b) => formProps[a][b]);
  return validateNumberField(field, key, min, max, pres);
};

const getPathLength = (formProps) => {
  const { pathNames } = formProps.rootNode || {};
  return pathNames && pathNames.length;
};

export default (formProps) => {
  let errors = {};
  const unit = formProps.unit;
  if (formProps && unit) {
    if (!unit.type || unit.type.trim().length === 0) {
      errors.type = I18n.t('musit.storageUnits.type.required');
    }
    if (!unit.name || unit.name.trim().length === 0) {
      errors.name = I18n.t('musit.storageUnits.name.required');
    }

    if (!unit.id) {
      if (new MusitNode(formProps.rootNode).isRootNode() && 'Organisation' !== unit.type) {
        errors = {...errors, type: I18n.t('musit.storageUnits.type.organisationAllowed')};
      }
      if (2 === getPathLength(formProps) && formProps.rootNode.type === 'Organisation' && 'Building' !== unit.type) {
        errors = {...errors, type: I18n.t('musit.storageUnits.type.buildingAllowed')};
      }
    }

    errors = { ...errors, ...validateStringField('type', unit.type, 100) };
    errors = { ...errors, ...validateStringField('name', unit.name, 100) };
    errors = { ...errors, ...validateStringField('address', unit.address, 100) };
    errors = { ...errors, ...validateNumberField('area', unit.area, 0, 10, 3) };
    errors = { ...errors, ...validateNumberField('areaTo', unit.areaTo, 0, 10, 3) };
    errors = { ...errors, ...validateNumberField('height', unit.height, 0, 10, 3) };
    errors = { ...errors, ...validateNumberField('heightTo', unit.heightTo, 0, 10, 3) };
    errors = { ...errors, ...validateEnvReq('environmentRequirement.temperature', 0, 10, 3, unit) };
    errors = { ...errors, ...validateEnvReq('environmentRequirement.temperatureTolerance', 0, 10, 0, unit) };
    errors = { ...errors, ...validateEnvReq('environmentRequirement.relativeHumidity', 0, 10, 3, unit) };
    errors = { ...errors, ...validateEnvReq('environmentRequirement.relativeHumidityTolerance', 0, 10, 0, unit) };
    errors = { ...errors, ...validateEnvReq('environmentRequirement.hypoxicAir', 0, 10, 3, unit) };
    errors = { ...errors, ...validateEnvReq('environmentRequirement.hypoxicAirTolerance', 0, 10, 0, unit) };
    const envReq = unit.environmentRequirement;
    errors = { ...errors, ...validateStringField('environmentRequirement.cleaning', envReq.cleaning, 100) };
    errors = { ...errors, ...validateStringField('environmentRequirement.lightingCondition', envReq.lightingCondition, 100) };
    errors = { ...errors, ...validateStringField('environmentRequirement.comments', envReq.comments, 250) };
  } else {
    errors.type = I18n.t('musit.storageUnits.type.required');
    errors.name = I18n.t('musit.storageUnits.name.required');
  }
  return errors;
};