import React, { PropTypes } from 'react';
import { formatISOString } from '../shared/util';

import { DATE_FORMAT_DISPLAY } from '../shared/util';

import DatePicker from 'react-bootstrap-date-picker';

const getNow = () => {
  return formatISOString(new Date());
};

const MusitDatePicker = props => {
  return (
    <DatePicker
      dateFormat={props.dateFormat}
      onClear={() => props.onClear(getNow())}
      value={props.value}
      onChange={newDate => props.onChange(formatISOString(newDate))}
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
