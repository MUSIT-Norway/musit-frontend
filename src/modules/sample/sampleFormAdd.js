import type { Field } from '../../forms/form';
import createForm from '../../forms/form';
import {
  composeValidators,
  isRequired,
  isNumeric,
  isAlphaNumeric
} from 'revalidate';

const musNo: Field<string> = {
  name: 'musNo',
  validator: composeValidators(
    isRequired,
    isAlphaNumeric
  )('musNo')
};

const subNo: Field<string> = {
  name: 'subNo',
  validator: composeValidators(
    isAlphaNumeric
  )('subNo')
};


const termSpeciesName: Field<string> = {
  name: 'termSpeciesName',
  validator: composeValidators(
    isAlphaNumeric
  )('termSpeciesName')
};

const sampleId: Field<number> = {
  name: 'sampleId',
  validator: composeValidators(
    isRequired,
    isNumeric
  )('sampleId')
};

const registeredBy: Field<string> = {
  name: 'registeredBy',
  validator: composeValidators(
    isRequired,
    isAlphaNumeric
  )('registeredBy')
};

const registeredDate: Field<string> = {
  name: 'registeredDate',
  validator: composeValidators(
    isRequired,
    isAlphaNumeric
  )('registeredDate')
};

const lastModifiedBy: Field<string> = {
  name: 'lastModifiedBy',
  validator: composeValidators(
    isRequired,
    isAlphaNumeric
  )('lastModifiedBy')
};

const lastModifiedDate: Field<string> = {
  name: 'lastModifiedDate',
  validator: composeValidators(
    isRequired,
    isAlphaNumeric
  )('lastModifiedDate')
};

const sampleType: Field<string> = {
  name: 'sampleType',
  validator: composeValidators(
    isRequired,
    isAlphaNumeric
  )('sampleType')
};

const sampleSubType: Field<string> = {
  name: 'sampleSubType',
  validator: composeValidators(
    isAlphaNumeric
  )('sampleSubType')
};

const status: Field<string> = {
  name: 'status',
  validator: composeValidators(
    isAlphaNumeric
  )('status')
};

const sampleVolumeWeight: Field<string> = {
  name: 'sampleVolumeWeight',
  validator: composeValidators(
    isNumeric
  )('sampleVolumeWeight')
};

const sampleVolumeWeightUnit: Field<string> = {
  name: 'sampleVolumeWeightUnit',
  validator: composeValidators(
    isAlphaNumeric
  )('sampleVolumeWeightUnit')
};

const storingContainer: Field<string> = {
  name: 'storingContainer',
  validator: composeValidators(
    isAlphaNumeric
  )('storingContainer')
};

const storingMedium: Field<string> = {
  name: 'storingMedium',
  validator: composeValidators(
    isAlphaNumeric
  )('storingMedium')
};

const sampleNote: Field<string> = {
  name: 'sampleNote',
  validator: composeValidators(
    isAlphaNumeric
  )('sampleNote')
};



export default createForm('sampleFormAdd.js', [ musNo, subNo, termSpeciesName, sampleId, registeredBy, registeredDate,
  lastModifiedBy, lastModifiedDate, sampleType, sampleSubType, status, sampleVolumeWeight, sampleVolumeWeightUnit,
  storingContainer, storingMedium, sampleNote]);
