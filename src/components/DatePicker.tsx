import * as React from 'react';
import { formatISOString } from '../shared/util';

import { DATE_FORMAT_DISPLAY } from '../shared/util';

import * as DatePicker from 'react-bootstrap-date-picker';
import { TODO } from '../types/common';

const getNow = () => {
  return formatISOString(new Date());
};

interface MusitDatePickerProps  {
  dateFormat: string, //PropTypes.string,
  value: string, //PropTypes.string,
  onChange: Function, // PropTypes.func.isRequired,
  onClear: Function, //PropTypes.func.isRequired,
  disabled?: boolean //PropTypes.bool
};

/* OLD:

MusitDatePicker.propTypes = {
  dateFormat: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

*/

const MusitDatePicker:React.SFC<MusitDatePickerProps>  = props => {
  return (
    <DatePicker
      dateFormat={props.dateFormat}
      onClear={() => props.onClear(getNow())}
      value={props.value}
      onChange={(newDate:TODO) => props.onChange(formatISOString(newDate))}
      disabled={props.disabled}
    />
  );
};

export default MusitDatePicker;


MusitDatePicker.defaultProps = {
  dateFormat: DATE_FORMAT_DISPLAY,
  disabled: false,
  value: getNow()
};
