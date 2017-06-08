// @flow
import createForm, { getStrField, getArrField, getNumberField } from '../../forms/form';

const objectId = getStrField('objectId');
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
const sampleNum = getNumberField('sampleNum');
const updatedBy = getStrField('updatedBy', null, false);
const updatedByName = getStrField('updatedByName', null, false);
const updatedDate = getStrField('updatedDate', null, false);
const registeredBy = getStrField('registeredBy', null, false);
const registeredByName = getStrField('registeredByName', null, false);
const registeredDate = getStrField('registeredDate', null, false);

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
  updatedByName,
  updatedDate,
  registeredBy,
  registeredByName,
  registeredDate,
  sampleNum
];

export default createForm('sampleViewForm.js', fields);
