import { I18n } from 'react-i18nify';
import MusitNode from '../models/node';
import { MUSTFIX, TODO } from '../types/common';

export const getPathLength = (formProps: TODO) => {
  const { pathNames } = (formProps || {}) as MUSTFIX;
  return pathNames && pathNames.length;
};

export const checkNodeType = (from: TODO, to: TODO) => {
  const matchFromType = from.value ? from.value.type : from.type;

  if (MusitNode.isRootNode(to) && 'Organisation' !== matchFromType) {
    return I18n.t('musit.storageUnits.type.organisationAllowedToMove');
  }

  if (
    2 === getPathLength(to) &&
    to.type === 'Organisation' &&
    'Building' !== matchFromType
  ) {
    return I18n.t('musit.storageUnits.type.buildingAllowedToMove');
  }
};

export const checkNodeBranch = (from: TODO, to: TODO) => {
  const pathNameFound = to.pathNames
    ? to.pathNames.filter((id: TODO) => {
        const matchOnValue = from.value && id.nodeId === from.value.id;
        return id.nodeId === from.id || matchOnValue;
      })
    : {};

  if (pathNameFound.length > 0) {
    return I18n.t('musit.storageUnits.type.notAllowedToMove');
  }
};

export const checkNodeBranchAndType = (from: TODO, to: TODO) => {
  return checkNodeType(from, to) || checkNodeBranch(from, to);
};
