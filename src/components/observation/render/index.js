
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
      {...props.layoutProps}
      {...props.valueProps}
      disabled={props.disabled}
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
      statusOnChange={(value) => props.onChangeField('statusValue', value, props.index)}
      volumeLabel={props.translate('musit.observation.page.alcohol.volumeLabel')}
      volumeTooltip={props.translate('musit.observation.page.alcohol.volumeTooltip')}
      volumePlaceHolder={props.translate('musit.observation.page.alcohol.volumePlaceHolder')}
      volumeOnChange={(value) => props.onChangeField('volumeValue', value, props.index)}
      commentLabel={props.translate('musit.observation.page.alcohol.commentLabel')}
      commentTooltip={props.translate('musit.observation.page.alcohol.commentTooltip')}
      commentPlaceHolder={props.translate('musit.observation.page.alcohol.commentPlaceHolder')}
      commentOnChange={(value) => props.onChangeField('commentValue', value, props.index)}
    />
  )
}

RenderAlcohol.propTypes = {
  translate: PropTypes.func.isRequired,
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
}

RenderAlcohol.defaultProps = {
  layoutProps: {
    statusWidth: 3,
    volumeWidth: 3,
    commentWidth: 4
  },
  onChangeField: () => true
}

export const RenderPest = (props) => {
  return (
    <ObservationPest
      {...props.layoutProps}
      disabled={props.disabled}
      canEdit={props.canEdit}
      observations={props.valueProps.observations}
      lifeCycleLabel={props.translate('musit.observation.page.pest.lifeCycleLabel')}
      lifeCyclePlaceHolder={props.translate('musit.texts.makeChoice')}
      lifeCycleTooltip={props.translate('musit.observation.page.pest.lifeCycleTooltip')}
      lifeCycleOnChange={(lifeCycleIndex, value) =>
        props.onChangePestObservation(lifeCycleIndex, 'lifeCycle', value, props.index)
      }
      lifeCycleOnRemove={(lifeCycleIndex) => props.onRemovePestObservation(lifeCycleIndex, props.index)}
      lifeCycleItems={[
        props.translate('musit.observation.page.pest.lifeCycleLabelMenu.puppe'),
        props.translate('musit.observation.pest.pest.lifeCycleLabelMenu.adult'),
        props.translate('musit.observation.pest.pest.lifeCycleLabelMenu.puppeskin'),
        props.translate('musit.observation.pest.pest.lifeCycleLabelMenu.larva'),
        props.translate('musit.observation.pest.pest.lifeCycleLabelMenu.egg')
      ]}
      countLabel={props.translate('musit.observation.page.pest.countLabel')}
      countTooltip={props.translate('musit.observation.page.pest.countTooltip')}
      countPlaceHolder={props.translate('musit.observation.page.pest.countPlaceHolder')}
      countOnChange={(countIndex, value) => props.onChangePestObservation(countIndex, 'count', value, props.index)}
      commentsLeftValue={props.valueProps.identificationValue}
      commentsLeftLabel={props.translate('musit.observation.page.pest.identificationLabel')}
      commentsLeftTooltip={props.translate('musit.observation.page.pest.identificationTooltip')}
      commentsLeftPlaceHolder={props.translate('musit.observation.page.pest.identificationPlaceHolder')}
      commentsOnChangeLeft={(value) => props.onChangeField('identificationValue', value, props.index)}
      commentsRightValue={props.valueProps.commentValue}
      commentsRightLabel={props.translate('musit.observation.page.pest.commentsLabel')}
      commentsRightTooltip={props.translate('musit.observation.page.pest.commentsTooltip')}
      commentsRightPlaceHolder={props.translate('musit.observation.page.pest.commentsPlaceHolder')}
      commentsOnChangeRight={(value) => props.onChangeField('commentValue', value, props.index)}
      newButtonLabel={props.translate('musit.observation.page.newButtonLabel')}
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
}

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
}

export const RenderDoubleTextArea = (props) => {
  return (
    <ObservationDoubleTextAreaComponent
      {...props.layoutProps}
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
  layoutProps: PropTypes.shape({
    leftWidth: PropTypes.number.isRequired,
    rightWidth: PropTypes.number.isRequired
  }),
  type: PropTypes.string.isRequired,
  disabled: PropTypes.bool
}

RenderDoubleTextArea.defaultProps = {
  layoutProps: {
    leftWidth: 5,
    rightWidth: 5
  },
  onChangeField: () => true
}


export const RenderFromToNumberComment = (props) => {
  return (
    <ObservationFromToNumberCommentComponent
      {...props.layoutProps}
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
  layoutProps: PropTypes.shape({
    fromWidth: PropTypes.number.isRequired,
    toWidth: PropTypes.number.isRequired,
    commentWidth: PropTypes.number.isRequired
  }),
  type: PropTypes.string.isRequired,
  disabled: PropTypes.bool
}

RenderFromToNumberComment.defaultProps = {
  layoutProps: {
    fromWidth: 3,
    toWidth: 3,
    commentWidth: 4
  },
  onChangeField: () => true
}
