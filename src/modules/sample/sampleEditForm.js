// @flow
import createForm, { getStrField, getArrField, getNumberField } from '../../forms/form';

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
const status = getNumberField('status', null, true);
const description = getStrField('description');
const treatment = getStrField('treatment');
const persons = getArrField('persons', []);
const leftoverSample = getNumberField('leftoverSample');
const originatedObjectUuid = getStrField('originatedObjectUuid');
const updatedBy = getStrField('updatedBy');
const updatedByName = getStrField('updatedByName');
const updatedDate = getStrField('updatedDate');
const registeredBy = getStrField('registeredBy');
const registeredByName = getStrField('registeredByName');
const registeredDate = getStrField('registeredDate');
const sampleNum = getNumberField('sampleNum');

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
  persons,
  originatedObjectUuid,
  updatedBy,
  updatedByName,
  updatedDate,
  registeredBy,
  registeredByName,
  registeredDate,
  sampleNum
];

export default createForm('sampleEditForm.js', fields);
