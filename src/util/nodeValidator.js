import { I18n } from 'react-i18nify'

const getPathLength = (formProps) => {
  const { pathNames } = formProps || {};
  return pathNames && pathNames.length;
};

export const checkNodeType = (from, to) => {

  if (to.type === 'Root' && 'Organisation' !== from.type) {
    return I18n.t('musit.storageUnits.type.organisationAllowedToMove');
  }

  if (2 === getPathLength(to) && to.type === 'Organisation' && 'Building' !== from.type) {
    return I18n.t('musit.storageUnits.type.buildingAllowedToMove');
  }

};

export const checkNodeBranch = (from, to) => {
  const pathNameFound = to.pathNames.filter(id => {
    const matchOnValue = from.value && id.nodeId === from.value.id;
    return id.nodeId === from.id || matchOnValue;
  });

  if ( pathNameFound.length > 0) {
    return I18n.t('musit.storageUnits.type.notAllowedToMove');
  }
};

export const checkNodeBranchAndType = (from, to) => {
  return checkNodeType(from, to) || checkNodeBranch(from, to);
};

