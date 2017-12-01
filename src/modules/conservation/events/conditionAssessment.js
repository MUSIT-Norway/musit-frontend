import React from 'react';
import { I18n } from 'react-i18nify';
import type { ConditionAssessmentProps } from '../../../types/conservation';
import SubEventComponentNote from '../components/subEventComponentNote';
import { DropdownButton, MenuItem } from 'react-bootstrap';

export default function ConditionAssessment(props: ConditionAssessmentProps) {
  const suffix = ':';
  const getDisplayNameForConditionCode = (v: number, conditionCodes, appSession) => {
    const conditionCodeObj = conditionCodes.find(c => c.conditionCode === v);
    return appSession.language.isEn
      ? conditionCodeObj.enCondition
      : conditionCodeObj.noCondition;
  };

  const extraAttributes = (
    <div>
      <div className="row form-group">
        <label
          className="control-label col-md-2"
          htmlFor={`conditionCode_${props.index}`}
        >
          {I18n.t('musit.conservation.events.conditionAssessment.conditionCode') + ':'}
        </label>
        <div className="col-md-9">
          {props.viewMode ? props.conditionAssessment.conditionCode ? (
            <div style={{ paddingTop: '8px' }}>
              {getDisplayNameForConditionCode(
                props.conditionAssessment.conditionCode,
                props.conditionCodes,
                props.appSession
              )}
            </div>
          ) : (
            ''
          ) : (
            <DropdownButton
              bsStyle="default"
              title={
                props.conditionAssessment.conditionCode ? (
                  getDisplayNameForConditionCode(
                    props.conditionAssessment.conditionCode,
                    props.conditionCodes,
                    props.appSession
                  )
                ) : (
                  I18n.t(
                    'musit.conservation.events.conditionAssessment.chooseConditionAssessment'
                  )
                )
              }
              id="conditionCode"
            >
              {props.conditionCodes &&
                props.conditionCodes.map((c, i) => (
                  <MenuItem
                    key={i}
                    onClick={() => {
                      props.onChange('conditionCode')(c.conditionCode);
                    }}
                  >
                    {props.appSession.language.isEn ? c.enCondition : c.noCondition}
                  </MenuItem>
                ))}
            </DropdownButton>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <SubEventComponentNote
      {...props}
      subEvent={props.conditionAssessment}
      eventName={I18n.t(
        'musit.conservation.events.conditionAssessment.conditionAssessment'
      )}
      noteLabel={I18n.t('musit.conservation.events.conditionAssessment.note')}
      extraAttributes={extraAttributes}
    />
  );
}
