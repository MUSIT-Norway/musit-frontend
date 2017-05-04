/* @flow */
import React, { PropTypes } from 'react';
//import { I18n } from 'react-i18nify';
/*import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  PageHeader,
  Panel,
  Radio,
  ButtonGroup,
  Well
} from 'react-bootstrap';
import { SaveCancel } from '../../../components/formfields/index';
import { hashHistory } from 'react-router';
import Config from '../../../config';
import type { AppSession } from '../../../types/appSession';
//import type { FormData } from './types/form';
import type { Field } from '../../../forms/form';
//import type { ObjectData } from '../../../types/object';
import { Table } from 'reactable';*/

const AnalysisTypesComponent = () => <div> hi</div>;

const FieldShape = {
  name: PropTypes.string.isRequired,
  rawValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.bool]),
  status: PropTypes.shape({
    valid: PropTypes.bool,
    error: PropTypes.any
  })
};

AnalysisTypesComponent.propTypes = {
  form: PropTypes.shape({
    id: PropTypes.shape(FieldShape).isRequired,
    analysisTypeId: PropTypes.shape(FieldShape).isRequired,
    analysisTypeCategory: PropTypes.shape(FieldShape).isRequired,
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

    restrictions: PropTypes.shape(FieldShape).isRequired,
    requester: PropTypes.shape(FieldShape).isRequired,
    expirationDate: PropTypes.shape(FieldShape).isRequired,
    reason: PropTypes.shape(FieldShape).isRequired,
    caseNumbers: PropTypes.shape(FieldShape).isRequired,
    cancelledBy: PropTypes.shape(FieldShape).isRequired,
    cancelledReason: PropTypes.shape(FieldShape).isRequired,

    completeAnalysis: PropTypes.shape(FieldShape).isRequired,
    museumNo: PropTypes.shape(FieldShape).isRequired,
    term: PropTypes.shape(FieldShape).isRequired
  }).isRequired,
  updateForm: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  saveAnalysisEvent: PropTypes.func
};

export default AnalysisTypesComponent;
