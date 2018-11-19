import * as React from 'react';
import { EventMetadataProps } from './CollectingEventComponent';
import DatePicker from '../../../components/DatePicker';
import EditAndSaveButtons from '../components/EditAndSaveButtons';

const EventMetadata = (props: EventMetadataProps) => {
  return (
    <div className="container-fluid panel-group">
      <div className="row form-group">
        <div className="col-md-6">
          <label htmlFor="txtInputProject">Project Name </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            id="txtInputProject"
            value={props.name || ''}
            disabled={props.readOnly}
            onChange={e => props.onChangeEventMetaData('name')(e.target.value)}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-3">
          <label htmlFor="dateFrom">From Date </label>
        </div>
        <div className="col-md-3">
          <label htmlFor="DateTo">To Date </label>
        </div>
        <div className="col-md-3">
          <label htmlFor="txtVerbatimDate">Verbatim dato </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-3" id="dateFrom">
          <DatePicker
            onClear={props.onClearBornDate}
            onChange={props.onChangeBornDate}
            value={props.eventDateFrom || ''}
            disabled={props.readOnly}
          />
        </div>
        <div className="col-md-3" id="DateTo">
          <DatePicker
            onClear={props.onClearDeathDate}
            onChange={props.onChangeDeathDate}
            value={props.eventDateTo || ''}
            disabled={props.readOnly}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            id={'txtVerbatimDate'}
            value={props.eventDateVerbatim || ''}
            onChange={e => props.onChangeVerbatimDate(e.target.value)}
            disabled={props.readOnly}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-3">
          <label htmlFor="projectName">Metode</label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-3">
          <select
            className="form-control"
            id="collectingMethod"
            defaultValue={undefined}
            disabled={props.readOnly}
            value={props.methodId}
            onChange={e => {
              props.onChangeEventMetaData('methodId')(e.target.value);
            }}
          >
            <option value={undefined}>{'Select value'}</option>
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
        <div className="col-md-6">
          <label htmlFor="methodDescription">Beskrivelse av metode </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-6">
          <textarea
            rows={4}
            className="form-control"
            id="methodDescription"
            value={props.methodDescription || ''}
            disabled={props.readOnly}
            onChange={(v: React.ChangeEvent<HTMLTextAreaElement>) =>
              props.onChangeEventMetaData('methodDescription')(v.target.value)
            }
          />
        </div>
      </div>

      <EditAndSaveButtons
        onClickCancel={() => {}}
        onClickEdit={() => {}}
        onClickSave={() => {}}
        editButtonState={{ visible: true, disabled: props.readOnly ? false : true }}
        cancelButtonState={{ visible: true, disabled: props.readOnly ? true : false }}
        saveButtonState={{ visible: true, disabled: props.readOnly ? true : false }}
        saveButtonText="Lagre"
        editButtonText="Endre"
        cancelButtonText="Avbryt"
      />
    </div>
  );
};

export default EventMetadata;
