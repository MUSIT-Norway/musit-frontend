// @flow
import createForm, { getStrField, getArrField, getNumberField } from '../../forms/form';

const objectId = getStrField('objectId');
const updatedBy = getStrField('updatedBy');
const updatedDate = getStrField('updatedDate');
const sampleId = getStrField('sampleId');
const externalId = getStrField('externalId');
const externalIdSource = getStrField('externalIdSource');
const container = getStrField('container');
const storageMedium = getStrField('storageMedium');
const note = getStrField('note');
const size = getNumberField('size');
const sizeUnit = getStrField('sizeUnit');
const sampleType = getStrField('sampleType');
const subTypeValue = getStrField('subTypeValue');
const status = getNumberField('status');
const description = getStrField('description');
const treatment = getStrField('treatment');
const persons = getArrField('persons', []);
const leftoverSample = getNumberField('leftoverSample');

const fields = [
  objectId,
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
  persons,
  updatedBy,
  updatedDate
];

export default createForm('sampleAddForm.js', fields);
