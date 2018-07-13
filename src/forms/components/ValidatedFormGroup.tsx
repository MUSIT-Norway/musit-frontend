// @flow
import * as React from 'react';
import { Field } from '../form';
import { Star } from '../../types/common';

type VFGProps = {
  fields?: Array<Field<Star>>;
  field?: Field<Star>;
};

export function isValid({ fields, field }: VFGProps) {
  if (!(fields && fields.length > 0) && !field) {
    throw new Error('No fields supplied. Fruitless. Exiting.');
  }
  return fields
    ? fields.reduce(
        (acc, field) => acc && field && !(field.status && !field.status.valid),
        true
      )
    : field && field.status && field.status.valid;
}

/**
 * @deprecated use FormElement component in ../components.js and pass in the hasError boolean property
 */
export default function ValidatedFormGroup(
  props: VFGProps & { children?: React.ReactNode }
) {
  return (
    <div className={`form-group${!isValid(props) ? ' has-error' : ''}`}>
      {props.children}
    </div>
  );
}
