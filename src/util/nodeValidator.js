import { I18n } from 'react-i18nify';

export const getPathLength = (formProps) => {
  const { pathNames } = formProps || {};
  return pathNames && pathNames.length;
};

export const checkNodeType = (from, to) => {

  const matchFromType = from.value ? from.value.type : from.type;

  if (to.type === 'Root' && 'Organisation' !== matchFromType) {
    return I18n.t('musit.storageUnits.type.organisationAllowedToMove');
  }

  if (2 === getPathLength(to) && to.type === 'Organisation' && 'Building' !== matchFromType) {
    return I18n.t('musit.storageUnits.type.buildingAllowedToMove');
  }

};

export const checkNodeBranch = (from, to) => {

  const pathNameFound = to.pathNames ? to.pathNames.filter(id => {
    const matchOnValue = from.value && id.nodeId === from.value.id;
    return id.nodeId === from.id || matchOnValue;
  }) : {};

  if ( pathNameFound.length > 0) {
    return I18n.t('musit.storageUnits.type.notAllowedToMove');
  }
};

export const checkNodeBranchAndType = (from, to) => {
  // console.log(JSON.stringify(from));
  // console.log(JSON.stringify(to));
  // console.log('checkNodeBranchAndType return =' + checkNodeType(from, to) + checkNodeBranch(from, to));

  return checkNodeType(from, to) || checkNodeBranch(from, to);
};

