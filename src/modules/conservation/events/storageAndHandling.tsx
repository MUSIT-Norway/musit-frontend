import React from 'react';
import { I18n } from 'react-i18nify';
import type { StorageAndHandlingProps } from '../../../types/conservation';
import SubEventComponentNote from '../components/subEventComponentNote';

export default function StorageAndHandling(props: StorageAndHandlingProps) {
  const suffix = ':';

  const extraAttributes = (
    <div>
      <div className="row form-group">
        <div className="col-md-5">
          <label className="control-label h4" htmlFor={`relativeHumidity_${props.index}`}>
            {I18n.t('musit.conservation.events.storageAndHandling.relativeHumidity') +
              suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`relativeHumidity_${props.index}`}>
              {props.storageAndHandling.relativeHumidity}
            </p>
          ) : (
            <input
              className="form-control"
              id={`relativeHumidity_${props.index}`}
              value={props.storageAndHandling.relativeHumidity}
              onChange={t => props.onChange('relativeHumidity')(t.target.value)}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-5">
          <label className="control-label h4" htmlFor={`temperature_${props.index}`}>
            {I18n.t('musit.conservation.events.storageAndHandling.temperature') + suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`temperature_${props.index}`}>
              {props.storageAndHandling.temperature}
            </p>
          ) : (
            <input
              className="form-control"
              id={`temperature_${props.index}`}
              value={props.storageAndHandling.temperature}
              onChange={t => props.onChange('temperature')(t.target.value)}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-5">
          <label className="control-label h4" htmlFor={`lightLevel_${props.index}`}>
            {I18n.t('musit.conservation.events.storageAndHandling.lightLevel') + suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`lightLevel_${props.index}`}>
              {props.storageAndHandling.lightLevel}
            </p>
          ) : (
            <input
              className="form-control"
              id={`lightAndUvLevel_${props.index}`}
              value={props.storageAndHandling.lightLevel}
              onChange={t => props.onChange('lightLevel')(t.target.value)}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-5">
          <label className="control-label h4" htmlFor={`uvLevel_${props.index}`}>
            {I18n.t('musit.conservation.events.storageAndHandling.uvLevel') + suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`uvLevel_${props.index}`}>
              {props.storageAndHandling.uvLevel}
            </p>
          ) : (
            <input
              className="form-control"
              id={`uvLevel_${props.index}`}
              value={props.storageAndHandling.uvLevel}
              onChange={t => props.onChange('uvLevel')(t.target.value)}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
    </div>
  );
  return (
    <SubEventComponentNote
      {...props}
      subEvent={props.storageAndHandling}
      eventName={I18n.t(
        'musit.conservation.events.storageAndHandling.storageAndHandling'
      )}
      noteLabel={I18n.t('musit.conservation.events.storageAndHandling.note')}
      extraAttributes={extraAttributes}
    />
  );
}
