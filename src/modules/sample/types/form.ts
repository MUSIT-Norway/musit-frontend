// @flow
import { Field } from '../../../forms/form';
import { Person } from '../../../types/person';

export type FormDetails = {
  note: Field<string>;
  size: Field<number>;
  status: Field<string>;
  externalId: Field<string>;
  externalIdSource: Field<string>;
  container: Field<string>;
  storageMedium: Field<string>;
  sampleType: Field<string>;
  sampleId: Field<string>;
  treatment: Field<string>;
  sampleSubType: Field<string>;
  sizeUnit: Field<string>;
  museumId: Field<string>;
  subNo: Field<string>;
  leftoverSample: Field<string>;
  term_species: Field<string>;
  registeredBy: Field<string>;
  registeredDate: Field<string>;
  registeredByName: Field<string>;
  updatedBy: Field<string>;
  updatedDate: Field<string>;
  updatedByName: Field<string>;
  hasRestMaterial: Field<string>;
  doneDate: Field<string>;
  description: Field<string>;
  persons: Field<Array<Person>>;
  statusText: Field<string>;
  sampleNum: Field<number>;
};
