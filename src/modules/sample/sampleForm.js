// @flow
import type { Field } from '../../forms/form';
import createForm, {
  getStrField,
  getArrField,
  getNumberField,
  getBoolField
} from '../../forms/form';
import { isRequired } from '../../forms/validators';
import { numberMapper } from '../../forms/mappers';

export type Person = {
  name?: string,
  role?: string,
  date?: string
};

const museumId = getStrField('museumId');
const parentObjectId = getStrField('parentObjectId');
const parentObjectType = getStrField('parentObjectType');
const subNo = getStrField('subNo');
const term_species = getStrField('term_species');
const responsible = getStrField('responsible');
const sampleId = getStrField('sampleId');
const isExtracted = getBoolField('isExtracted', false);
const externalId = getStrField('externalId');
const externalIdSource = getStrField('externalIdSource');
const doneDate = getStrField('doneDate');
const registeredBy = getStrField('registeredBy');
const registeredDate = getStrField('registeredDate');
const updatedBy = getStrField('updatedBy');
const updatedDate = getStrField('updatedDate');
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
const persons = getArrField('persons', [{ name: '', role: 'creator' }]);
const originatedObjectUuid = getArrField('originatedObjectUuid');
const leftoverSample: Field<number> = {
  name: 'leftoverSample',
  mapper: numberMapper,
  defaultValue: 1,
  validator: {
    rawValidator: isRequired
  }
};

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
  museumId,
  subNo,
  term_species,
  leftoverSample,
  parentObjectId,
  sampleId,
  treatment,
  isExtracted,
  registeredBy,
  parentObjectType,
  registeredDate,
  responsible,
  updatedBy,
  updatedDate,
  doneDate,
  originatedObjectUuid,
  persons
];

export default createForm('sampleForm.js', fields);
