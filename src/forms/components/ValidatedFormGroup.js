// @flow
import React, { Children } from 'react';
import type { Field } from 'forms/form';

type VFGProps = {
  fields?: Array<Field<*>>,
  field?: Field<*>,
  children?: Children
};

export default function ValidatedFormGroup({ fields, field, children }: VFGProps) {
  if (!(fields && fields.length > 0) && !field) {
    throw new Error('No fields supplied. Fruitless. Exiting.');
  }
  const isValid = fields
    ? fields.reduce((acc, f) => acc && !(f.status && !f.status.valid), true)
    : field && field.status && field.status.valid;
  return (
    <div className={`form-group${!isValid ? ' has-error' : ''}`}>
      {children}
    </div>
  );
}
