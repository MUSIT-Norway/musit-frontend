import React from 'react';
import type { Field } from 'forms/form';

type VFGProps = {
  fields?: Array<Field<*>>,
  field?: Field<*>,
  children?: Children
};

export default function ValidatedFormGroup({ fields, field, children }: VFGProps) {
  if (fields && fields.length > 0 && field) {
    throw new Error('Either fill in `fields` or `field`, not both');
  }
  const isInvalid = fields
    ? fields.reduce(
        (acc, f) => f.status && !f.status.valid /* && f.value !== f.defaultValue*/,
        false
      )
    : false;
  return (
    <div className={`form-group ${isInvalid ? 'has-error' : ''}`}>
      {children}
    </div>
  );
}
