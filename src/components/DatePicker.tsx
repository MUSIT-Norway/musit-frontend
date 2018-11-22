import * as React from 'react';
import { formatISOString } from '../shared/util';

import { DATE_FORMAT_DISPLAY } from '../shared/util';

import * as DatePicker from 'react-16-bootstrap-date-picker';
import { TODO } from 'src/types/common';


export const getNow = () => {
  return formatISOString(new Date());
};

interface MusitDatePickerProps {
  dateFormat?: string; //PropTypes.string,
  value?: string; //PropTypes.string,
  onChange: Function; // PropTypes.func.isRequired,
  onClear: Function; //PropTypes.func.isRequired,
  disabled?: boolean; //PropTypes.bool
  defaultValue?: string;
}

/* Old:

MusitDatePicker.propTypes = {
  dateFormat: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

*/

const MusitDatePicker: React.SFC<MusitDatePickerProps> = props => {
  return (
    <DatePicker
      dateFormat={props.dateFormat}
      onClear={() => props.onClear(getNow())}
      value={props.value ? props.value : props.defaultValue}
      onChange={(newDate: TODO) => {
        const d = newDate ? formatISOString(newDate) : undefined;
        props.onChange(d);
      }}
      disabled={props.disabled}
    />
  );
};

export default MusitDatePicker;

MusitDatePicker.defaultProps = {
  dateFormat: DATE_FORMAT_DISPLAY,
  disabled: false
};
