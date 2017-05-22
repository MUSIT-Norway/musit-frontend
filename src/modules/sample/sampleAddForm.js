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
const subTypeValue = getStrField('subTypeValue');
const status = getStrField('status');
const description = getStrField('description');
const treatment = getStrField('treatment');
const persons = getArrField('persons', [{ name: '', role: 'creator', date: '' }]);
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
