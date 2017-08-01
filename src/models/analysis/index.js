// @flow

import {
  getAnalysisTypes,
  saveAnalysisType,
  getAnalysisCategories,
  getPurposes,
  getAnalysisLabList,
  loadPredefinedTypes
} from './analysisTypes';

import { importResult, addResult } from './analysisResult';

import {
  saveAnalysisEvent,
  getAnalysisById,
  editAnalysisEvent,
  getAnalysesForObject,
  getAnalysisEvents,
  getAnalysisTypesForCollection
} from './analysis';

import { fromJsonToForm } from './analysisForm';

export default {
  getAnalysisTypes,
  saveAnalysisType,
  getAnalysisCategories,
  getPurposes,
  getAnalysisLabList,
  loadPredefinedTypes,
  importResult,
  addResult,
  getAnalysisTypesForCollection,
  getAnalysisEvents,
  getAnalysesForObject,
  editAnalysisEvent,
  getAnalysisById,
  saveAnalysisEvent,
  fromJsonToForm
};
