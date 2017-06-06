import React from 'react';
import PropTypes from 'prop-types';
import ObservationFromToNumberCommentComponent from './ObservationFromToNumberCommentComponent';
import ObservationDoubleTextAreaComponent from './ObservationDoubleTextAreaComponent';
import ObservationStatusPercentageComment from './ObservationStatusPercentageComment';
import ObservationPest from './ObservationPest';
import { I18n } from 'react-i18nify';

export const RenderAlcohol = props => {
  return (
    <ObservationStatusPercentageComment
      {...props.layoutProps}
      {...props.valueProps}
      disabled={props.disabled}
      statusLabel={I18n.t('musit.observation.page.alcohol.statusLabel')}
      statusTooltip={I18n.t('musit.observation.page.alcohol.statusTooltip')}
      statusPlaceHolder={I18n.t('musit.observation.page.alcohol.statusPlaceHolder')}
      statusItems={['satisfactory', 'someDryed', 'allmostDryed', 'dryed']}
      statusItemsTranslateKeyPrefix="musit.observation.page.alcohol.statusItems."
      statusOnChange={value => props.onChangeField('statusValue', value, props.index)}
      volumeLabel={I18n.t('musit.observation.page.alcohol.volumeLabel')}
      volumeTooltip={I18n.t('musit.observation.page.alcohol.volumeTooltip')}
      volumePlaceHolder={I18n.t('musit.observation.page.alcohol.volumePlaceHolder')}
      volumeOnChange={value => props.onChangeField('volumeValue', value, props.index)}
      commentLabel={I18n.t('musit.observation.page.alcohol.commentLabel')}
      commentTooltip={I18n.t('musit.observation.page.alcohol.commentTooltip')}
      commentPlaceHolder={I18n.t('musit.observation.page.alcohol.commentPlaceHolder')}
      commentOnChange={value => props.onChangeField('commentValue', value, props.index)}
    />
  );
};

RenderAlcohol.propTypes = {
  onChangeField: PropTypes.func,
  index: PropTypes.number,
  valueProps: PropTypes.shape({
    statusValue: PropTypes.string,
    volumeValue: PropTypes.string,
    commentValue: PropTypes.string
  }).isRequired,
  layoutProps: PropTypes.shape({
    statusWidth: PropTypes.number.isRequired,
    volumeWidth: PropTypes.number.isRequired,
    commentWidth: PropTypes.number.isRequired
  }),
  disabled: PropTypes.bool
};

RenderAlcohol.defaultProps = {
  layoutProps: {
    statusWidth: 3,
    volumeWidth: 3,
    commentWidth: 4
  },
  onChangeField: () => true
};

export const RenderPest = props => {
  return (
    <ObservationPest
      {...props.layoutProps}
      disabled={props.disabled}
      canEdit={props.canEdit}
      observations={props.valueProps.observations}
      lifeCycleLabel={I18n.t('musit.observation.page.pest.lifeCycleLabel')}
      lifeCyclePlaceHolder={I18n.t('musit.texts.makeChoice')}
      lifeCycleTooltip={I18n.t('musit.observation.page.pest.lifeCycleTooltip')}
      lifeCycleOnChange={(lifeCycleIndex, value) =>
        props.onChangePestObservation(lifeCycleIndex, 'lifeCycle', value, props.index)}
      lifeCycleOnRemove={lifeCycleIndex =>
        props.onRemovePestObservation(lifeCycleIndex, props.index)}
      lifeCycleItems={['puppe', 'adult', 'puppeskin', 'larva', 'egg']}
      lifeCycleItemsTranslateKeyPrefix="musit.observation.page.pest.lifeCycleLabelMenu."
      countLabel={I18n.t('musit.observation.page.pest.countLabel')}
      countTooltip={I18n.t('musit.observation.page.pest.countTooltip')}
      countPlaceHolder={I18n.t('musit.observation.page.pest.countPlaceHolder')}
      countOnChange={(countIndex, value) =>
        props.onChangePestObservation(countIndex, 'count', value, props.index)}
      commentsLeftValue={props.valueProps.identificationValue}
      commentsLeftLabel={I18n.t('musit.observation.page.pest.identificationLabel')}
      commentsLeftTooltip={I18n.t('musit.observation.page.pest.identificationTooltip')}
      commentsLeftPlaceHolder={I18n.t(
        'musit.observation.page.pest.identificationPlaceHolder'
      )}
      commentsOnChangeLeft={value =>
        props.onChangeField('identificationValue', value, props.index)}
      commentsRightValue={props.valueProps.commentValue}
      commentsRightLabel={I18n.t('musit.observation.page.pest.commentsLabel')}
      commentsRightTooltip={I18n.t('musit.observation.page.pest.commentsTooltip')}
      commentsRightPlaceHolder={I18n.t('musit.observation.page.pest.commentsPlaceHolder')}
      commentsOnChangeRight={value =>
        props.onChangeField('commentValue', value, props.index)}
      newButtonLabel={I18n.t('musit.observation.page.newButtonLabel')}
      newButtonOnClick={() => props.onClickAddObservation(props.index)}
    />
  );
};

RenderPest.propTypes = {
  onChangePestObservation: PropTypes.func,
  onClickAddObservation: PropTypes.func,
  onRemovePestObservation: PropTypes.func,
  index: PropTypes.number,
  valueProps: PropTypes.shape({
    observations: PropTypes.arrayOf(
      PropTypes.shape({
        count: PropTypes.string,
        lifeCycle: PropTypes.string
      })
    ),
    identificationValue: PropTypes.string,
    commentValue: PropTypes.string
  }).isRequired,
  layoutProps: PropTypes.shape({
    lifeCycleWidth: PropTypes.number.isRequired,
    countWidth: PropTypes.number.isRequired,
    removeIconWidth: PropTypes.number.isRequired,
    addIconWidth: PropTypes.number.isRequired,
    commentsLeftWidth: PropTypes.number.isRequired,
    commentsRightWidth: PropTypes.number.isRequired
  }),
  disabled: PropTypes.bool,
  canEdit: PropTypes.bool
};

RenderPest.defaultProps = {
  layoutProps: {
    lifeCycleWidth: 2,
    countWidth: 2,
    removeIconWidth: 1,
    addIconWidth: 1,
    commentsLeftWidth: 5,
    commentsRightWidth: 5
  },
  onChangePestObservation: () => true,
  onClickAddObservation: () => true,
  onRemovePestObservation: () => true,
  canEdit: true
};

export const RenderDoubleTextArea = props => {
  return (
    <ObservationDoubleTextAreaComponent
      {...props.layoutProps}
      {...props.valueProps}
      disabled={props.disabled}
      leftLabel={I18n.t(`musit.observation.page.${props.type}.leftLabelText`)}
      leftTooltip={I18n.t(`musit.observation.page.${props.type}.leftLabelText`)}
      leftPlaceHolder={I18n.t(
        `musit.observation.page.${props.type}.leftLabelPlaceHolder`
      )}
      onChangeLeft={value => props.onChangeField('leftValue', value, props.index)}
      rightLabel={I18n.t(`musit.observation.page.${props.type}.rightLabelText`)}
      rightTooltip={I18n.t(`musit.observation.page.${props.type}.rightLabelPlaceToolTip`)}
      rightPlaceHolder={I18n.t(
        `musit.observation.page.${props.type}.rightLabelPlaceHolder`
      )}
      onChangeRight={value => props.onChangeField('rightValue', value, props.index)}
    />
  );
};

RenderDoubleTextArea.propTypes = {
  onChangeField: PropTypes.func,
  index: PropTypes.number,
  valueProps: PropTypes.shape({
    leftValue: PropTypes.string,
    rightValue: PropTypes.string
  }).isRequired,
  layoutProps: PropTypes.shape({
    leftWidth: PropTypes.number.isRequired,
    rightWidth: PropTypes.number.isRequired
  }),
  type: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

RenderDoubleTextArea.defaultProps = {
  layoutProps: {
    leftWidth: 5,
    rightWidth: 5
  },
  onChangeField: () => true
};

export const RenderFromToNumberComment = props => {
  return (
    <ObservationFromToNumberCommentComponent
      {...props.layoutProps}
      {...props.valueProps}
      disabled={props.disabled}
      fromLabel={I18n.t(`musit.observation.page.${props.type}.fromValueLabelText`)}
      fromTooltip={I18n.t(`musit.observation.page.${props.type}.fromValueTooltip`)}
      fromPlaceHolder={I18n.t(
        `musit.observation.page.${props.type}.fromValuePlaceHolder`
      )}
      onChangeFrom={value => props.onChangeField('fromValue', value, props.index)}
      toLabel={I18n.t(`musit.observation.page.${props.type}.toValueLabelText`)}
      toTooltip={I18n.t(`musit.observation.page.${props.type}.toValueTooltip`)}
      toPlaceHolder={I18n.t(`musit.observation.page.${props.type}.toValuePlaceHolder`)}
      onChangeTo={value => props.onChangeField('toValue', value, props.index)}
      commentLabel={I18n.t(`musit.observation.page.${props.type}.note`)}
      commentTooltip={I18n.t(`musit.observation.page.${props.type}.noteTooltip`)}
      commentPlaceholder={I18n.t(`musit.observation.page.${props.type}.notePlaceHolder`)}
      onChangeComment={value => props.onChangeField('commentValue', value, props.index)}
    />
  );
};

RenderFromToNumberComment.propTypes = {
  onChangeField: PropTypes.func,
  index: PropTypes.number,
  valueProps: PropTypes.shape({
    fromValue: PropTypes.string,
    toValue: PropTypes.string,
    commentValue: PropTypes.string
  }).isRequired,
  layoutProps: PropTypes.shape({
    fromWidth: PropTypes.number.isRequired,
    toWidth: PropTypes.number.isRequired,
    commentWidth: PropTypes.number.isRequired
  }),
  type: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

RenderFromToNumberComment.defaultProps = {
  layoutProps: {
    fromWidth: 3,
    toWidth: 3,
    commentWidth: 4
  },
  onChangeField: () => true
};
