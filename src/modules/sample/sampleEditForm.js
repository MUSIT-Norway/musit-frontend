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
const subTypeValue = getNumberField('subTypeValue');
const status = getNumberField('status');
const description = getStrField('description');
const treatment = getStrField('treatment');
const persons = getArrField('persons', [{ name: '', role: 'creator' }]);
const leftoverSample = getNumberField('leftoverSample');
const originatedObjectUuid = getStrField('originatedObjectUuid');

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
  originatedObjectUuid
];

export default createForm('sampleAddForm.js', fields);
