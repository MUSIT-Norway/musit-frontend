// @flow
import createForm, { getStrField, getArrField, getNumberField } from '../../forms/form';
import { STATUS_INTACT_ID } from '../../models/sample';

const sampleId = getStrField('sampleId', null, false);
const externalId = getStrField('externalId', null, false);
const externalIdSource = getStrField('externalIdSource', null, false);
const container = getStrField('container', null, false);
const storageMedium = getStrField('storageMedium', null, false);
const note = getStrField('note', null, false);
const size = getNumberField('size', null, false);
const sizeUnit = getStrField('sizeUnit', null, false);
const sampleType = getStrField('sampleType', null, false);
const subTypeValue = getStrField('subTypeValue');
const status = getNumberField('status', STATUS_INTACT_ID);
const description = getStrField('description', null, false);
const treatment = getStrField('treatment', null, false);
const persons = getArrField('persons', [], false);
const leftoverSample = getNumberField('leftoverSample', 1, false);

const fields = [
  note,
  status,
  size,
  sizeUnit,
  container,
  externalId,
  externalIdSource,
  description,
  storageMedium,
  subTypeValue,
  sampleType,
  leftoverSample,
  sampleId,
  treatment,
  persons
];

export default createForm('sampleAddForm.js', fields);
