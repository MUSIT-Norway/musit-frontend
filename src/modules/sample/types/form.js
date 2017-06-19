import type { Field } from 'forms/form';
import type { Person } from '../../../components/person/PersonRoleDate';

export type FormDetails = {
  note: Field<string>,
  size: Field<string>,
  status: Field<string>,
  externalId: Field<string>,
  externalIdSource: Field<string>,
  container: Field<string>,
  storageMedium: Field<string>,
  sampleType: Field<string>,
  sampleId: Field<string>,
  treatment: Field<string>,
  subTypeValue: Field<string>,
  sizeUnit: Field<string>,
  museumId: Field<string>,
  subNo: Field<string>,
  leftoverSample: Field<string>,
  term_species: Field<string>,
  registeredBy: Field<string>,
  registeredDate: Field<string>,
  updatedBy: Field<string>,
  hasRestMaterial: Field<string>,
  updateDate: Field<string>,
  sampleId: Field<string>,
  doneDate: Field<string>,
  description: Field<string>,
  persons: Field<Array<Person>>,
  statusText: Field<string>
};
