import { I18n } from 'react-i18nify';
import MusitNode from '../models/node';

export const getPathNamesLength = (target) => {
  const { pathNames } = target || {};
  return pathNames ? pathNames.length : 0;
};

export const checkNodeType = (from, target) => {
  const fromType = from.value ? from.value.type : from.type;
  if (MusitNode.isRootNode(target.type) && fromType !== 'Organisation') {
    return I18n.t('musit.storageUnits.type.organisationAllowedToMove');
  }
  if (getPathNamesLength(target) === 2 && target.type === 'Organisation' && fromType !== 'Building') {
    return I18n.t('musit.storageUnits.type.buildingAllowedToMove');
  }
};

const isSameNodeId = (from) => (to) => {
  const matchOnValue = from.value && to.nodeId === from.value.id;
  const matchOnId = to.nodeId === from.id;
  return matchOnId || matchOnValue;
};

export const checkNodeBranch = (from, to) => {
  const matchingTargetNodes = to.pathNames ? to.pathNames.filter(isSameNodeId(from)) : [];
  if ( matchingTargetNodes.length > 0) {
    return I18n.t('musit.storageUnits.type.notAllowedToMove');
  }
};

export const checkNodeBranchAndType = (from, to) => {
  return checkNodeType(from, to) || checkNodeBranch(from, to);
};

