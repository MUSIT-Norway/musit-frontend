// @flow
import createForm, { getStrField, getArrField, getNumberField } from '../../forms/form';
import { STATUS_INTACT_ID } from '../../models/sample';

const sampleId = getStrField('sampleId');
const externalId = getStrField('externalId');
const externalIdSource = getStrField('externalIdSource');
const container = getStrField('container');
const storageMedium = getStrField('storageMedium');
const note = getStrField('note');
const size = getNumberField('size');
const sizeUnit = getStrField('sizeUnit');
const sampleType = getStrField('sampleType');
const sampleSubType = getStrField('sampleSubType', null, true);
const status = getNumberField('status', STATUS_INTACT_ID, true);
const description = getStrField('description');
const treatment = getStrField('treatment');
const persons = getArrField('persons', []);
const leftoverSample = getNumberField('leftoverSample', 1);

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
  sampleSubType,
  sampleType,
  leftoverSample,
  sampleId,
  treatment,
  persons
];

export default createForm('sampleAddForm.js', fields);
