/* @flow */
import React, { PropTypes } from 'react';
import { AppSession } from '../app/appSession';
import AnalysisComponent from './AnalysisComponent';

type Field = { name: string, rawValue: ?string };
type FormData = {
  id:  Field,
  analysisTypeId:  Field,
  doneBy:  Field,
  doneDate:  Field,
  registeredBy:  Field,
  registeredDate:  Field,

  responsible:  Field,

  administrator:  Field,
  completedBy:  Field,
  completedDate:  Field,
  objectId:  Field,
  note:  Field,
  type:  Field,

  partOf:  Field,
  result:  Field,
  place:  Field,

  externalSource:  Field,
  comments:  Field,

  restrictions:  Field,
  by:  Field,
  expirationDate:  Field,
  reason:  Field,
  caseNumbers:  Field,
  cancelledBy:  Field,
  cancelledReason:  Field,

  completeAnalysis:  Field,
  museumNo:  Field,
  term:  Field
};

type AnalysisType = { id: number, name: string };
type ObjectData = { uuid: string }
type Store = { objectsData: ObjectData[], analysisTypes: AnalysisType[] };
type Update = (update: Field) => void;
type Props = {
  form: FormData,
  updateForm: Update,
  store: Store,
  appSession: AppSession,
  saveAnalysisEvent: Function
};

const AnalysisAdd = ({ form, updateForm, store, saveAnalysisEvent, appSession } : Props) => (
  <AnalysisComponent
    form={form}
    updateForm={updateForm}
    store={store}
    addOrUpdateAnalysisEvent={saveAnalysisEvent}
    appSession={appSession}
    mode="ADD"
  />
);

const FieldShape = {
  name: PropTypes.string.isRequired,
  rawValue: PropTypes.string,
  status: PropTypes.shape({
    valid: PropTypes.bool,
    error: PropTypes.any
  })
};

const FieldShapeBoolean = {
  name: PropTypes.string.isRequired,
  rawValue: PropTypes.bool,
  status: PropTypes.shape({
    valid: PropTypes.bool,
    error: PropTypes.any
  })
};

AnalysisAdd.propTypes = {
  form: PropTypes.shape({

    id: PropTypes.shape(FieldShape).isRequired,
    analysisTypeId: PropTypes.shape(FieldShape).isRequired,
    doneBy: PropTypes.shape(FieldShape).isRequired,
    doneDate: PropTypes.shape(FieldShape).isRequired,
    registeredBy: PropTypes.shape(FieldShape).isRequired,
    registeredDate: PropTypes.shape(FieldShape).isRequired,

    responsible: PropTypes.shape(FieldShape).isRequired,

    administrator: PropTypes.shape(FieldShape).isRequired,
    completedBy: PropTypes.shape(FieldShape).isRequired,
    completedDate: PropTypes.shape(FieldShape).isRequired,
    objectId: PropTypes.shape(FieldShape).isRequired,
    note: PropTypes.shape(FieldShape).isRequired,
    type: PropTypes.shape(FieldShape),

    partOf: PropTypes.shape(FieldShape).isRequired,
    result: PropTypes.shape(FieldShape).isRequired,
    place: PropTypes.shape(FieldShape).isRequired,

    externalSource: PropTypes.shape(FieldShape).isRequired,
    comments: PropTypes.shape(FieldShape).isRequired,

    restrictions: PropTypes.shape(FieldShapeBoolean).isRequired,
    by: PropTypes.shape(FieldShape).isRequired,
    expirationDate: PropTypes.shape(FieldShape).isRequired,
    reason: PropTypes.shape(FieldShape).isRequired,
    caseNumbers: PropTypes.shape(FieldShape).isRequired,
    cancelledBy: PropTypes.shape(FieldShape).isRequired,
    cancelledReason: PropTypes.shape(FieldShape).isRequired,

    completeAnalysis: PropTypes.shape(FieldShapeBoolean).isRequired,
    museumNo: PropTypes.shape(FieldShape).isRequired,
    term: PropTypes.shape(FieldShape).isRequired
  }).isRequired,
  updateForm: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  saveAnalysisEvent: PropTypes.func
};

export default AnalysisAdd;