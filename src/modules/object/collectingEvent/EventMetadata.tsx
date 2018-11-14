import * as React from 'react';
import { EventMetadataProps } from './CollectingEventComponent';
import DatePicker from '../../../components/DatePicker';

const EventMetadata = (props: EventMetadataProps) => {
  return (
    <div>
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
            value={props.name}
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
            value={props.eventDateFrom}
            // disabled={props.readOnly}
          />
        </div>
        <div className="col-md-2" id="deathDate">
          <DatePicker
            onClear={props.onClearDeathDate}
            onChange={props.onChangeDeathDate}
            value={props.eventDateTo}
            // disabled={props.readOnly}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            id={'txtVerbatimDate'}
            value={props.eventDateVerbatim}
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
        <div className="col-md-3">
          <select
            className="form-control"
            id="coordinateSource"
            defaultValue=""
            onChange={e => {
              props.onChangeEventMetaData('methodId')(e.target.value);
            }}
          >
            <option value={undefined} selected>
              {'Select value'}
            </option>
            {props.collectingEventMethods ? (
              props.collectingEventMethods.map(
                (
                  { methodId, method }: { methodId: number; method: string },
                  i: number
                ) => (
                  <option key={`optionRow_${i}`} value={methodId}>
                    {method}
                  </option>
                )
              )
            ) : (
              <option key={`optionRow_${1}`}>{'No data'}</option>
            )}
          </select>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-4">
          <label htmlFor="locality">Beskrivelse av metode </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-6">
          <textarea
            rows={4}
            className="form-control"
            id="locality"
            value={props.note}
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
