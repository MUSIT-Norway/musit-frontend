//@flow
import * as React from 'react';
import MusitDatePicker from '../../components/DatePicker';

export type TimeProps = {
  from?: Date;
  to?: Date;
  verbatimDate?: string;
  labelFrom?: string;
  labelTo?: string;
  onChange: Function;
  onClear: Function;
};

export type TimeState = {
  from?: Date;
  to?: Date;
  verbatimDate?: string;
};

export default class TimeAndDate extends React.Component<TimeProps, TimeState> {
  constructor(props: TimeProps) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <div className="col-md-2">
          <label htmlFor="dateFrom">{this.props.labelFrom || 'Date from'}</label>
          <MusitDatePicker
            //className="form-control"
            onChange={this.props.onChange('dateFrom')}
            onClear={this.props.onClear}
          />
        </div>
        <div className="col-md-2">
          <label htmlFor="dateFrom">{this.props.labelTo || 'Date to'}</label>
          <MusitDatePicker
            //className="form-control"
            onChange={this.props.onChange('dateTo')}
            onClear={this.props.onClear}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="verbatimDate">Verbatim date</label>
          <input className="form-control" id="verbatimDate" type="text" />
        </div>
      </div>
    );
  }
}
