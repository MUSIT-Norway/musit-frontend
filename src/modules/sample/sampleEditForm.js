// @flow
import createForm, { getStrField, getArrField, getNumberField } from '../../forms/form';

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
const status = getNumberField('status');
const description = getStrField('description', null, false);
const treatment = getStrField('treatment', null, false);
const persons = getArrField('persons', [], false);
const leftoverSample = getNumberField('leftoverSample', null, false);
const originatedObjectUuid = getStrField('originatedObjectUuid');
const updatedBy = getStrField('updatedBy', null, false);
const updatedByName = getStrField('updatedByName', null, false);
const updatedDate = getNumberField('updatedDate', null, false);
const registeredBy = getStrField('registeredBy', null, false);
const registeredByName = getStrField('registeredByName', null, false);
const registeredDate = getNumberField('registeredDate', null, false);
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
  subTypeValue,
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
