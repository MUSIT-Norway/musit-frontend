import React, { PropTypes } from 'react';
import { localToISOString } from '../shared/util';

import { DATE_FORMAT_DISPLAY } from './util';

import DatePicker from 'react-bootstrap-date-picker';

const fixDate = (dateValue) => {
  if (!dateValue) {
    return '';
  }
  const date = dateValue.split('T')[0];
  return `${date}T00:00:00.000Z`;
};

const getNow = () => {
  return localToISOString(new Date());
};

const MusitDatePicker = (props) => {
  return (
    <DatePicker
      dateFormat={props.dateFormat}
      onClear={() => props.onClear(getNow())}
      value={props.value}
      onChange={newDate => props.onChange(fixDate(newDate))}
      disabled={props.disabled}
    />
  );
};

export default MusitDatePicker;

MusitDatePicker.propTypes = {
  dateFormat: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

MusitDatePicker.defaultProps = {
  dateFormat: DATE_FORMAT_DISPLAY,
  disabled: false,
  value: getNow()
};