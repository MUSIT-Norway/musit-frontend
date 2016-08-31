import React from 'react'
import {
  ObservationFromToNumberCommentComponent,
  ObservationDoubleTextAreaComponent,
  ObservationStatusPercentageComment,
  ObservationPest
} from '../../../components/observation'

export const RenderAlcohol = (props) => {
  return (
    <ObservationStatusPercentageComment
      {...props.valueProps}
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
      volumeLabel={props.translate('musit.storageUnits.environmentRequirements.alcohol.volumeLabel')}
      volumeTooltip={props.translate('musit.storageUnits.environmentRequirements.alcohol.volumeTooltip')}
      volumePlaceHolder={props.translate('musit.storageUnits.environmentRequirements.alcohol.volumePlaceHolder')}
      volumeOnChange={(value) => props.onChangeField('volume', value, props.index)}
      commentValue={props.valueProps.comment}
      commentLabel={props.translate('musit.storageUnits.environmentRequirements.alcohol.commentLabel')}
      commentTooltip={props.translate('musit.storageUnits.environmentRequirements.alcohol.commentTooltip')}
      commentPlaceHolder={props.translate('musit.storageUnits.environmentRequirements.alcohol.commentPlaceHolder')}
      commentOnChange={(value) => props.onChangeField('comment', value, props.index)}
    />
  )
}

export const RenderPest = (props) => {
  return (
    <ObservationPest
      disabled={props.mode === 'VIEW'}
      canEdit={props.mode !== 'VIEW'}
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

export const RenderDoubleTextArea = (props) => {
  return (
    <ObservationDoubleTextAreaComponent
      {...props.valueProps}
      disabled={props.mode === 'VIEW'}
      leftLabel={props.translate(`musit.storageUnits.environmentRequirements.${props.type}.labelText`)}
      leftTooltip={props.translate(`musit.storageUnits.environmentRequirements.${props.type}.tooltip`)}
      leftPlaceHolder={props.translate(`musit.storageUnits.environmentRequirements.${props.type}.placeHolder`)}
      onChangeLeft={(value) => props.onChangeField('leftValue', value, props.index)}
      rightLabel={props.translate(`musit.storageUnits.environmentRequirements.${props.type}.comment`)}
      rightTooltip={props.translate(`musit.storageUnits.environmentRequirements.${props.type}.comment`)}
      rightPlaceHolder={props.translate(`musit.storageUnits.environmentRequirements.${props.type}.commentPlaceHolder`)}
      onChangeRight={(value) => props.onChangeField('rightValue', value, props.index)}
    />
  )
}

export const RenderFromToNumberComment = (props) => {
  return (
    <ObservationFromToNumberCommentComponent
      {...props.valueProps}
      disabled={props.mode === 'VIEW'}
      fromLabel={props.translate(`musit.storageUnits.environmentRequirements.${props.type}.labelText`)}
      fromTooltip={props.translate(`musit.storageUnits.environmentRequirements.${props.type}.tooltip`)}
      fromPlaceHolder={props.translate(`musit.storageUnits.environmentRequirements.${props.type}.placeHolder`)}
      onChangeFrom={(value) => props.onChangeField('fromValue', value, props.index)}
      toLabel={props.translate(`musit.storageUnits.environmentRequirements.${props.type}Tolerance.labelText`)}
      toTooltip={props.translate(`musit.storageUnits.environmentRequirements.${props.type}Tolerance.tooltip`)}
      toPlaceHolder={props.translate(`musit.storageUnits.environmentRequirements.${props.type}Tolerance.placeHolder`)}
      onChangeTo={(value) => props.onChangeField('toValue', value, props.index)}
      commentLabel={props.translate(`musit.storageUnits.environmentRequirements.${props.type}.comment`)}
      commentTooltip={props.translate(`musit.storageUnits.environmentRequirements.${props.type}.comment`)}
      commentPlaceholder={props.translate('musit.texts.freetext')}
      onChangeComment={(value) => props.onChangeField('commentValue', value, props.index)}
    />
  )
}
