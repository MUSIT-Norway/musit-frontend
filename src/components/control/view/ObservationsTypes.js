import React from 'react'
import {
  ObservationFromToNumberCommentComponent,
  ObservationDoubleTextAreaComponent,
  ObservationStatusPercentageComment,
  ObservationPest
} from '../../../components/observation'

export const propss = {
  mode: React.PropTypes.oneOf(['ADD', 'VIEW', 'EDIT']).isRequired,
  typeDefinitions: {
    '': { label: 'typeSelect.labelText' },
    temperature: { label: 'temperature.labelText', render: this.renderTemperature },
    gas: { label: 'gas.labelText', render: this.renderGas },
    lux: { label: 'lux.labelText', render: this.renderLux },
    cleaning: { label: 'cleaning.labelText', render: this.renderCleaning },
    pest: { label: 'pest.labelText', render: this.renderPest, props: { observations: [{ lifeCycle: '', count: '' }] } },
    mold: { label: 'mold.labelText', render: this.renderMold },
    skallsikring: { label: 'skallsikring.labelText', render: this.renderSkallsikring },
    tyverisikring: { label: 'tyverisikring.labelText', render: this.renderTyverisikring },
    brannsikring: { label: 'brannsikring.labelText', render: this.renderBrannsikring },
    vannskaderisiko: { label: 'vannskaderisiko.labelText', render: this.renderVannskaderisiko },
    rh: { label: 'rh.labelText', render: this.renderRelativeHumidity },
    hypoxicAir: { label: 'hypoxicAir.labelText', render: this.renderHypoxicAir },
    alcohol: { label: 'alcohol.labelText', render: this.renderAlcohol }
  }
}

export const renderAlcohol = (props) => {
  return (
    <ObservationStatusPercentageComment
      {...props}
      statusOptionValues={[
        this.props.translate('alcohol.statusItems.dryed'),
        this.props.translate('alcohol.statusItems.allmostDryed'),
        this.props.translate('alcohol.statusItems.someDryed'),
        this.props.translate('alcohol.statusItems.minorDryed'),
        this.props.translate('alcohol.statusItems.satisfactory')
      ]}
    />
  )
}

export const renderPest = () => {
  return (
    <ObservationPest
      disabled={this.props.mode === 'VIEW'}
      canEdit={this.props.mode !== 'VIEW'}
      observations={this.props.observations}
      lifeCycle={{
        label: this.props.translate('musit.observation.pest.lifeCycleLabel'),
        placeHolder: this.props.translate('musit.texts.makeChoice'),
        tooltip: this.props.translate('musit.observation.pest.lifeCycleTooltip'),
        onChange: (index, value) => this.onChangePestObservation(index, 'lifeCycle', value),
        onRemove: (index) => this.onRemovePestObservation(index),
        items: [
          this.props.translate('musit.observation.lifeCycleLabelMenu.puppe'),
          this.props.translate('musit.observation.lifeCycleLabelMenu.adult'),
          this.props.translate('musit.observation.lifeCycleLabelMenu.puppeskin'),
          this.props.translate('musit.observation.lifeCycleLabelMenu.larva'),
          this.props.translate('musit.observation.lifeCycleLabelMenu.egg')
        ]
      }}
      count={{
        label: this.props.translate('musit.observation.pest.countLabel'),
        placeHolder: this.props.translate('musit.observation.pest.countPlaceHolder'),
        tooltip: this.props.translate('musit.observation.pest.countTooltip'),
        onChange: (index, value) => this.onChangePestObservation(index, 'count', value)
      }}
      comments={{
        leftValue: this.props.identificationValue,
        leftLabel: this.props.translate('musit.observation.pest.identificationLabel'),
        leftTooltip: this.props.translate('musit.observation.pest.identificationTooltip'),
        onChangeLeft: (value) => this.onChangeField('pest', 'identificationValue', value),
        rightValue: this.props.commentValue,
        rightLabel: this.props.translate('musit.observation.pest.commentsLabel'),
        rightTooltip: this.props.translate('musit.observation.pest.commentsTooltip'),
        onChangeRight: (value) => this.onChangeField('pest', 'commentValue', value),
      }}
      newButton={{
        label: this.props.translate('musit.observation.newButtonLabel'),
        onClick: this.onClickAddObservation
      }}
    />
  )
}

export const renderBrannsikring = (props) => {
  return (
    <ObservationDoubleTextAreaComponent
      {...props}
      id={"brannsikring"}
      disabled={this.props.mode === 'VIEW'}
      leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.brannsikring.labelText')}
      leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.brannsikring.tooltip')}
      onChangeLeft={(value) => this.onChangeField('brannsikring', 'leftValue', value)}
      rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.brannsikring.comment')}
      rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.brannsikring.comment')}
      onChangeRight={(value) => this.onChangeField('brannsikring', 'rightValue', value)}
    />
  )
}

export const renderVannskaderisiko = (props) => {
  return (
    <ObservationDoubleTextAreaComponent
      {...props}
      id={"vannskaderisiko"}
      disabled={this.props.mode === 'VIEW'}
      leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.vannskaderisiko.labelText')}
      leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.vannskaderisiko.tooltip')}
      onChangeLeft={(value) => this.onChangeField('vannskaderisiko', 'leftValue', value)}
      rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.vannskaderisiko.comment')}
      rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.vannskaderisiko.comment')}
      onChangeRight={(value) => this.onChangeField('vannskaderisiko', 'rightValue', value)}
    />
  )
}

export const renderTyverisikring = (props) => {
  return (
    <ObservationDoubleTextAreaComponent
      {...props}
      id={"tyverisikring"}
      disabled={this.props.mode === 'VIEW'}
      leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.tyverisikring.labelText')}
      leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.tyverisikring.tooltip')}
      onChangeLeft={(value) => this.onChangeField('tyverisikring', 'leftValue', value)}
      rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.tyverisikring.comment')}
      rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.tyverisikring.comment')}
      onChangeRight={(value) => this.onChangeField('tyverisikring', 'rightValue', value)}
    />
  )
}

export const renderSkallsikring = (props) => {
  return (
    <ObservationDoubleTextAreaComponent
      {...props}
      id={"skallsikring"}
      disabled={this.props.mode === 'VIEW'}
      leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.skallsikring.labelText')}
      leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.skallsikring.tooltip')}
      onChangeLeft={(value) => this.onChangeField('skallsikring', 'leftValue', value)}
      rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.skallsikring.comment')}
      rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.skallsikring.comment')}
      onChangeRight={(value) => this.onChangeField('skallsikring', 'rightValue', value)}
    />
  )
}

export const renderMold = (props) => {
  return (
    <ObservationDoubleTextAreaComponent
      {...props}
      id={"mold"}
      disabled={this.props.mode === 'VIEW'}
      leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.mold.labelText')}
      leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.mold.tooltip')}
      onChangeLeft={(value) => this.onChangeField('mold', 'leftValue', value)}
      rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.mold.comment')}
      rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.mold.comment')}
      onChangeRight={(value) => this.onChangeField('mold', 'rightValue', value)}
    />
  )
}

export const renderCleaning = (props) => {
  return (
    <ObservationDoubleTextAreaComponent
      {...props}
      id={"cleaning"}
      disabled={this.props.mode === 'VIEW'}
      leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.cleaning.labelText')}
      leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.cleaning.tooltip')}
      onChangeLeft={(value) => this.onChangeField('cleaning', 'leftValue', value)}
      rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.cleaning.comment')}
      rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.cleaning.comment')}
      onChangeRight={(value) => this.onChangeField('cleaning', 'rightValue', value)}
    />
  )
}

export const renderLux = (props) => {
  return (
    <ObservationDoubleTextAreaComponent
      {...props}
      id={"lux"}
      disabled={this.props.mode === 'VIEW'}
      leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.lightCondition.labelText')}
      leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.lightCondition.tooltip')}
      onChangeLeft={(value) => this.onChangeField('lux', 'leftValue', value)}
      rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.lightCondition.comment')}
      rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.lightCondition.comment')}
      onChangeRight={(value) => this.onChangeField('lux', 'rightValue', value)}
    />
  )
}

export const renderGas = (props) => {
  return (
    <ObservationDoubleTextAreaComponent
      {...props}
      id={"gas"}
      disabled={this.props.mode === 'VIEW'}
      leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.gas.labelText')}
      leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.gas.tooltip')}
      onChangeLeft={(value) => this.onChangeField('gas', 'leftValue', value)}
      rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.gas.comment')}
      rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.gas.comment')}
      onChangeRight={(value) => this.onChangeField('gas', 'rightValue', value)}
    />
  )
}

export const renderHypoxicAir = (props) => {
  return (
    <ObservationFromToNumberCommentComponent
      {...props}
      id={"hypoxicAir"}
      disabled={this.props.mode === 'VIEW'}
      fromLabel={this.props.translate('musit.storageUnits.environmentRequirements.inertAir.labelText')}
      fromTooltip={this.props.translate('musit.storageUnits.environmentRequirements.inertAir.tooltip')}
      onChangeFrom={(value) => this.onChangeField('hypoxicAir', 'fromValue', value)}
      toLabel={this.props.translate('musit.storageUnits.environmentRequirements.inertAirTolerance.labelText')}
      toTooltip={this.props.translate('musit.storageUnits.environmentRequirements.inertAirTolerance.tooltip')}
      onChangeTo={(value) => this.onChangeField('hypoxicAir', 'toValue', value)}
      commentLabel={this.props.translate('musit.storageUnits.environmentRequirements.inertAir.comment')}
      commentTooltip={this.props.translate('musit.storageUnits.environmentRequirements.inertAir.comment')}
      commentPlaceholder={this.props.translate('musit.texts.freetext')}
      onChangeComment={(value) => this.onChangeField('hypoxicAir', 'commentValue', value)}
    />
  )
}

export const renderRelativeHumidity = (props) => {
  return (
    <ObservationFromToNumberCommentComponent
      {...props}
      id={"rh"}
      disabled={this.props.mode === 'VIEW'}
      fromLabel={this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidity.labelText')}
      fromTooltip={this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidity.tooltip')}
      onChangeFrom={(value) => this.onChangeField('rh', 'fromValue', value)}
      toLabel={this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidityTolerance.labelText')}
      toTooltip={this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidityTolerance.tooltip')}
      onChangeTo={(value) => this.onChangeField('rh', 'toValue', value)}
      commentLabel={this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidity.comment')}
      commentTooltip={this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidity.comment')}
      commentPlaceholder={this.props.translate('musit.texts.freetext')}
      onChangeComment={(value) => this.onChangeField('rh', 'commentValue', value)}
    />
  )
}

export const renderTemperature = (props) => {
  return (
    <ObservationFromToNumberCommentComponent
      {...props}
      id={"temperature"}
      disabled={this.props.mode === 'VIEW'}
      fromLabel={this.props.translate('musit.storageUnits.environmentRequirements.temperature.labelText')}
      fromTooltip={this.props.translate('musit.storageUnits.environmentRequirements.temperature.tooltip')}
      onChangeFrom={(value) => this.onChangeField('temperature', 'fromValue', value)}
      toLabel={this.props.translate('musit.storageUnits.environmentRequirements.temperatureTolerance.labelText')}
      toTooltip={this.props.translate('musit.storageUnits.environmentRequirements.temperatureTolerance.tooltip')}
      onChangeTo={(value) => this.onChangeField('temperature', 'toValue', value)}
      commentLabel={this.props.translate('musit.storageUnits.environmentRequirements.temperature.comment')}
      commentTooltip={this.props.translate('musit.storageUnits.environmentRequirements.temperature.comment')}
      commentPlaceholder={this.props.translate('musit.texts.freetext')}
      onChangeComment={(value) => this.onChangeField('temperature', 'commentValue', value)}
    />
  )
}
