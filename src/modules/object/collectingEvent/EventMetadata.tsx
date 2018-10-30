import * as React from 'react';
import { EventMetadataProps } from './CollectingEvents';
import DatePicker from '../../../components/DatePicker';

const EventMetadata = (props: EventMetadataProps) => {
  return (
    <div className="row well">
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="projectName">Project Name </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            id={'txtInputProject'}
            value={props.eventState.name}
            onChange={e => props.onChangeEventMetaData('name')(e.target.value)}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="projectName">From Date </label>
        </div>
        <div className="col-md-2">
          <label htmlFor="projectName">To Date </label>
        </div>
        <div className="col-md-2">
          <label htmlFor="projectName">Verbatim dato </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2" id="bornDate">
          <DatePicker
            onClear={props.onClearBornDate}
            onChange={props.onChangeBornDate}
            value={props.eventState.eventDateFrom}
            // disabled={props.readOnly}
          />
        </div>
        <div className="col-md-2" id="deathDate">
          <DatePicker
            onClear={props.onClearDeathDate}
            onChange={props.onChangeDeathDate}
            value={props.eventState.eventDateTo}
            // disabled={props.readOnly}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            id={'txtVerbatimDate'}
            value={props.eventState.eventDateVerbatim}
            onChange={e => props.onChangeVerbatimDate(e.target.value)}
            // disabled={props.readOnly}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="projectName">Metode</label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <select
            className="form-control"
            id="selectMetode"
            value={''}
            onChange={e => {
              e.preventDefault();
              //props.onChangeProjectName(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="locality">Beskrivelse av metode </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-8">
          <textarea
            rows={6}
            className="form-control"
            id="locality"
            value={props.eventState.note}
            onChange={(v: React.ChangeEvent<HTMLTextAreaElement>) =>
              props.onChangeEventMetaData('note')(v.target.value)
            }
          />
        </div>
      </div>
      <div className="row form-group" />
    </div>
  );
};

export default EventMetadata;
