import React, { PropTypes } from 'react'
import {
  ObservationFromToNumberCommentComponent,
  ObservationDoubleTextAreaComponent,
  ObservationStatusPercentageComment,
  ObservationPest
} from '../../../components/observation'

export const RenderAlcohol = (props) => {
  return (
    <ObservationStatusPercentageComment
      disabled={props.disabled}
      statusValue={props.valueProps.status}
      statusLabel={props.translate('musit.observation.page.alcohol.statusLabel')}
      statusTooltip={props.translate('musit.observation.page.alcohol.statusTooltip')}
      statusPlaceHolder={props.translate('musit.observation.page.alcohol.statusPlaceHolder')}
      statusItems={[
        props.translate('musit.observation.page.alcohol.statusItems.dryed'),
        props.translate('musit.observation.page.alcohol.statusItems.allmostDryed'),
        props.translate('musit.observation.page.alcohol.statusItems.someDryed'),
        props.translate('musit.observation.page.alcohol.statusItems.minorDryed'),
        props.translate('musit.observation.page.alcohol.statusItems.satisfactory')
      ]}
      statusOnChange={(value) => props.onChangeField('status', value, props.index)}
      volumeValue={props.valueProps.volume}
      volumeLabel={props.translate('musit.observation.page.alcohol.volumeLabel')}
      volumeTooltip={props.translate('musit.observation.page.alcohol.volumeTooltip')}
      volumePlaceHolder={props.translate('musit.observation.page.alcohol.volumePlaceHolder')}
      volumeOnChange={(value) => props.onChangeField('volume', value, props.index)}
      commentValue={props.valueProps.comment}
      commentLabel={props.translate('musit.observation.page.alcohol.commentLabel')}
      commentTooltip={props.translate('musit.observation.page.alcohol.commentTooltip')}
      commentPlaceHolder={props.translate('musit.observation.page.alcohol.commentPlaceHolder')}
      commentOnChange={(value) => props.onChangeField('comment', value, props.index)}
    />
  )
}

RenderAlcohol.propTypes = {
  translate: PropTypes.func.isRequired,
  onChangeField: PropTypes.func,
  index: PropTypes.number,
  valueProps: PropTypes.shape({
    status: PropTypes.string,
    volume: PropTypes.string,
    comment: PropTypes.string
  }).isRequired,
  disabled: PropTypes.bool,
  canEdit: PropTypes.bool
}

RenderAlcohol.defaultProps = {
  onChangeField: () => true
}

export const RenderPest = (props) => {
  return (
    <ObservationPest
      disabled={props.disabled}
      canEdit={props.canEdit}
      observations={props.valueProps.observations}
      lifeCycleLabel={props.translate('musit.observation.pest.lifeCycleLabel')}
      lifeCyclePlaceHolder={props.translate('musit.texts.makeChoice')}
      lifeCycleTooltip={props.translate('musit.observation.pest.lifeCycleTooltip')}
      lifeCycleOnChange={(lifeCycleIndex, value) =>
        props.onChangePestObservation(lifeCycleIndex, 'lifeCycle', value, props.index)
      }
      lifeCycleOnRemove={(lifeCycleIndex) => props.onRemovePestObservation(lifeCycleIndex, props.index)}
      lifeCycleItems={[
        props.translate('musit.observation.lifeCycleLabelMenu.puppe'),
        props.translate('musit.observation.lifeCycleLabelMenu.adult'),
        props.translate('musit.observation.lifeCycleLabelMenu.puppeskin'),
        props.translate('musit.observation.lifeCycleLabelMenu.larva'),
        props.translate('musit.observation.lifeCycleLabelMenu.egg')
      ]}
      countLabel={props.translate('musit.observation.pest.countLabel')}
      countPlaceHolder={props.translate('musit.observation.pest.countPlaceHolder')}
      countTooltip={props.translate('musit.observation.pest.countTooltip')}
      countOnChange={(countIndex, value) => props.onChangePestObservation(countIndex, 'count', value, props.index)}
      commentsLeftValue={props.valueProps.identificationValue}
      commentsLeftLabel={props.translate('musit.observation.pest.identificationLabel')}
      commentsLeftTooltip={props.translate('musit.observation.pest.identificationTooltip')}
      commentsLeftPlaceHolder={props.translate('musit.observation.pest.identificationPlaceHolder')}
      commentsOnChangeLeft={(value) => props.onChangeField('identificationValue', value, props.index)}
      commentsRightValue={props.valueProps.commentValue}
      commentsRightLabel={props.translate('musit.observation.pest.commentsLabel')}
      commentsRightTooltip={props.translate('musit.observation.pest.commentsTooltip')}
      commentsRightPlaceHolder={props.translate('musit.observation.pest.commentsPlaceHolder')}
      commentsOnChangeRight={(value) => props.onChangeField('commentValue', value, props.index)}
      newButtonLabel={props.translate('musit.observation.newButtonLabel')}
      newButtonOnClick={() => props.onClickAddObservation(props.index)}
    />
  )
}

RenderPest.propTypes = {
  translate: PropTypes.func.isRequired,
  onChangePestObservation: PropTypes.func,
  onClickAddObservation: PropTypes.func,
  onRemovePestObservation: PropTypes.func,
  index: PropTypes.number,
  valueProps: PropTypes.shape({
    observations: PropTypes.arrayOf(PropTypes.object),
    identificationValue: PropTypes.string,
    commentValue: PropTypes.string
  }).isRequired,
  disabled: PropTypes.bool,
  canEdit: PropTypes.bool
}

RenderPest.defaultProps = {
  onChangePestObservation: () => true,
  onClickAddObservation: () => true,
  onRemovePestObservation: () => true,
  canEdit: true
}

export const RenderDoubleTextArea = (props) => {
  return (
    <ObservationDoubleTextAreaComponent
      {...props.valueProps}
      disabled={props.disabled}
      leftLabel={props.translate(`musit.observation.page.${props.type}.leftLabelText`)}
      leftTooltip={props.translate(`musit.observation.page.${props.type}.leftLabelText`)}
      leftPlaceHolder={props.translate(`musit.observation.page.${props.type}.leftLabelPlaceHolder`)}
      onChangeLeft={(value) => props.onChangeField('leftValue', value, props.index)}
      rightLabel={props.translate(`musit.observation.page.${props.type}.rightLabelText`)}
      rightTooltip={props.translate(`musit.observation.page.${props.type}.rightLabelPlaceToolTip`)}
      rightPlaceHolder={props.translate(`musit.observation.page.${props.type}.rightLabelPlaceHolder`)}
      onChangeRight={(value) => props.onChangeField('rightValue', value, props.index)}
    />
  )
}

RenderDoubleTextArea.propTypes = {
  translate: PropTypes.func.isRequired,
  onChangeField: PropTypes.func,
  index: PropTypes.number,
  valueProps: PropTypes.shape({
    leftValue: PropTypes.string,
    rightValue: PropTypes.string
  }).isRequired,
  type: PropTypes.string.isRequired,
  disabled: PropTypes.bool
}

RenderDoubleTextArea.defaultProps = {
  onChangeField: () => true
}


export const RenderFromToNumberComment = (props) => {
  return (
    <ObservationFromToNumberCommentComponent
      {...props.valueProps}
      disabled={props.disabled}
      fromLabel={props.translate(`musit.observation.page.${props.type}.fromValueLabelText`)}
      fromTooltip={props.translate(`musit.observation.page.${props.type}.fromValueTooltip`)}
      fromPlaceHolder={props.translate(`musit.observation.page.${props.type}.fromValuePlaceHolder`)}
      onChangeFrom={(value) => props.onChangeField('fromValue', value, props.index)}
      toLabel={props.translate(`musit.observation.page.${props.type}.toValueLabelText`)}
      toTooltip={props.translate(`musit.observation.page.${props.type}.toValueTooltip`)}
      toPlaceHolder={props.translate(`musit.observation.page.${props.type}.toValuePlaceHolder`)}
      onChangeTo={(value) => props.onChangeField('toValue', value, props.index)}
      commentLabel={props.translate(`musit.observation.page.${props.type}.note`)}
      commentTooltip={props.translate(`musit.observation.page.${props.type}.noteTooltip`)}
      commentPlaceholder={props.translate(`musit.observation.page.${props.type}.notePlaceHolder`)}
      onChangeComment={(value) => props.onChangeField('commentValue', value, props.index)}
    />
  )
}

RenderFromToNumberComment.propTypes = {
  translate: PropTypes.func.isRequired,
  onChangeField: PropTypes.func,
  index: PropTypes.number,
  valueProps: PropTypes.shape({
    fromValue: PropTypes.string,
    toValue: PropTypes.string,
    commentValue: PropTypes.string
  }).isRequired,
  type: PropTypes.string.isRequired,
  disabled: PropTypes.bool
}

RenderFromToNumberComment.defaultProps = {
  onChangeField: () => true
}
