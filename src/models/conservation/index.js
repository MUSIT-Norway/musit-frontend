// @flow
import {
  getConservationForObject,
  getConservationById,
  editConservationEvent,
  getConservationTypes,
  loadPredefinedConservationTypes,
  saveConservationEvent
} from './conservation';

import { fromJsonToForm } from './conservationForm';

export default {
  fromJsonToForm,
  getConservationForObject,
  getConservationById,
  editConservationEvent,
  getConservationTypes,
  loadPredefinedConservationTypes,
  saveConservationEvent
};
