// @flow

import {
  getAnalysisTypes,
  getAnalysisCategories,
  getPurposes,
  getAnalysisLabList,
  loadPredefinedTypes,
  getAnalysisTypesForCollection
} from './analysisTypes';

import { importResult, addResult } from './analysisResult';

import {
  saveAnalysisEvent,
  getAnalysisById,
  editAnalysisEvent,
  getAnalysesForObject,
  getAnalysisEvents
} from './analysis';

import { fromJsonToForm } from './analysisForm';

export default {
  getAnalysisTypes,
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
