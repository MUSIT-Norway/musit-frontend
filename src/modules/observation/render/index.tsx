import * as React from 'react';
import * as PropTypes from 'prop-types';
import ObservationFromToNumberCommentComponent from './ObservationFromToNumberCommentComponent';
import ObservationDoubleTextAreaComponent from './ObservationDoubleTextAreaComponent';
import ObservationStatusPercentageComment from './ObservationStatusPercentageComment';
import ObservationPest from './ObservationPest';
import { I18n } from 'react-i18nify';
import { TODO, TODO_REMOVE, Maybe } from '../../../types/common';

type OnChangeField = ((_1: string, _2: TODO, _3: Maybe<number>) => TODO);

export const RenderAlcohol = (props: RenderAlcoholProps) => {
  return (
    <ObservationStatusPercentageComment
      {...props.layoutProps!} //Todo: Remove ! when we get proper support for defaultProps in TS 3.0
      {...props.valueProps}
      disabled={props.disabled}
      statusLabel={I18n.t('musit.observation.page.alcohol.statusLabel')}
      statusTooltip={I18n.t('musit.observation.page.alcohol.statusTooltip')}
      statusPlaceHolder={I18n.t('musit.observation.page.alcohol.statusPlaceHolder')}
      statusItems={['satisfactory', 'someDryed', 'allmostDryed', 'dryed']}
      statusItemsTranslateKeyPrefix="musit.observation.page.alcohol.statusItems."
      statusOnChange={
        (value: TODO) => props.onChangeField!('statusValue', value, props.index) //Todo: Remove ! when we get proper support for defaultProps in TS 3.0
      }
      volumeLabel={I18n.t('musit.observation.page.alcohol.volumeLabel')}
      volumeTooltip={I18n.t('musit.observation.page.alcohol.volumeTooltip')}
      volumePlaceHolder={I18n.t('musit.observation.page.alcohol.volumePlaceHolder')}
      volumeOnChange={
        (value: TODO) => props.onChangeField!('volumeValue', value, props.index) //Todo: Remove ! when we get proper support for defaultProps in TS 3.0
      }
      commentLabel={I18n.t('musit.observation.page.alcohol.commentLabel')}
      commentTooltip={I18n.t('musit.observation.page.alcohol.commentTooltip')}
      commentPlaceHolder={I18n.t('musit.observation.page.alcohol.commentPlaceHolder')}
      commentOnChange={
        (value: TODO) => props.onChangeField!('commentValue', value, props.index) //Todo: Remove ! when we get proper support for defaultProps in TS 3.0
      }
    />
  );
};

(RenderAlcohol as TODO_REMOVE).propTypes = {
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

export interface RenderAlcoholValueProps {
  statusValue?: string;
  volumeValue?: string;
  commentValue?: string;
}

interface RenderAlcoholLayoutProps {
  statusWidth: number;
  volumeWidth: number;
  commentWidth: number;
}

export interface RenderAlcoholProps {
  onChangeField?: OnChangeField; //Todo: Make required in TS 3.0, when we get proper support for defaultProps
  index?: number;
  valueProps: RenderAlcoholValueProps;
  layoutProps?: RenderAlcoholLayoutProps; //Todo: Make required in TS 3.0, when we get proper support for defaultProps
  disabled?: boolean;
}

const renderAlcoholDefaultProps: Partial<RenderAlcoholProps> = {
  layoutProps: {
    statusWidth: 3,
    volumeWidth: 3,
    commentWidth: 4
  },
  onChangeField: () => true
};

(RenderAlcohol as TODO_REMOVE).defaultProps = renderAlcoholDefaultProps;

export const RenderPest = (props: RenderPestProps) => {
  return (
    <ObservationPest
      {...props.layoutProps!} //Todo: Remove ! when we get proper support for defaultProps in TS 3.0
      disabled={props.disabled}
      canEdit={props.canEdit}
      observations={props.valueProps.observations || []} //TODO: Check if ok with empty array
      lifeCycleLabel={I18n.t('musit.observation.page.pest.lifeCycleLabel')}
      lifeCyclePlaceHolder={I18n.t('musit.texts.makeChoice')}
      lifeCycleTooltip={I18n.t('musit.observation.page.pest.lifeCycleTooltip')}
      lifeCycleOnChange={
        (lifeCycleIndex: TODO, value: TODO) =>
          props.onChangePestObservation!(lifeCycleIndex, 'lifeCycle', value, props.index) //Todo: Remove ! when we get proper support for defaultProps in TS 3.0
      }
      lifeCycleOnRemove={
        (lifeCycleIndex: TODO) =>
          props.onRemovePestObservation!(lifeCycleIndex, props.index) //Todo: Remove ! when we get proper support for defaultProps in TS 3.0
      }
      lifeCycleItems={['puppe', 'adult', 'puppeskin', 'larva', 'egg']}
      lifeCycleItemsTranslateKeyPrefix="musit.observation.page.pest.lifeCycleLabelMenu."
      countLabel={I18n.t('musit.observation.page.pest.countLabel')}
      countTooltip={I18n.t('musit.observation.page.pest.countTooltip')}
      countPlaceHolder={I18n.t('musit.observation.page.pest.countPlaceHolder')}
      countOnChange={
        (countIndex: TODO, value: TODO) =>
          props.onChangePestObservation!(countIndex, 'count', value, props.index) //Todo: Remove ! when we get proper support for defaultProps in TS 3.0
      }
      commentsLeftValue={props.valueProps.identificationValue}
      commentsLeftLabel={I18n.t('musit.observation.page.pest.identificationLabel')}
      commentsLeftTooltip={I18n.t('musit.observation.page.pest.identificationTooltip')}
      commentsLeftPlaceHolder={I18n.t(
        'musit.observation.page.pest.identificationPlaceHolder'
      )}
      commentsOnChangeLeft={(value: TODO) =>
        props.onChangeField('identificationValue', value, props.index)
      }
      commentsRightValue={props.valueProps.commentValue}
      commentsRightLabel={I18n.t('musit.observation.page.pest.commentsLabel')}
      commentsRightTooltip={I18n.t('musit.observation.page.pest.commentsTooltip')}
      commentsRightPlaceHolder={I18n.t('musit.observation.page.pest.commentsPlaceHolder')}
      commentsOnChangeRight={(value: TODO) =>
        props.onChangeField('commentValue', value, props.index)
      }
      newButtonLabel={I18n.t('musit.observation.page.newButtonLabel')}
      newButtonOnClick={() => props.onClickAddObservation!(props.index)} //Todo: Remove ! when we get proper support for defaultProps in TS 3.0
    />
  );
};

interface RenderPestValueItem {
  count?: string;
  lifeCycle?: string;
}
export interface RenderPestValueProps {
  observations?: RenderPestValueItem[];
  identificationValue?: string;
  commentValue?: string;
}

interface RenderPestLayoutProps {
  lifeCycleWidth: number;
  countWidth: number;
  removeIconWidth: number;
  addIconWidth: number;
  commentsLeftWidth: number;
  commentsRightWidth: number;
}

interface RenderPestProps {
  onChangePestObservation?: Function; //Todo: Make required in TS 3.0, when we get proper support for defaultProps
  onClickAddObservation?: Function; //Todo: Make required in TS 3.0, when we get proper support for defaultProps
  onRemovePestObservation?: Function; //Todo: Make required in TS 3.0, when we get proper support for defaultProps
  index?: number;

  valueProps: RenderPestValueProps;
  layoutProps?: RenderPestLayoutProps; //Todo: Make required in TS 3.0, when we get proper support for defaultProps
  disabled?: boolean;
  canEdit?: boolean;

  onChangeField: OnChangeField; //Added this as it seems to be used...
}

(RenderPest as TODO_REMOVE).propTypes = {
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

const renderPestDefaultProps: Partial<RenderPestProps> = {
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

(RenderPest as TODO_REMOVE).defaultProps = renderPestDefaultProps;

export const RenderDoubleTextArea = (props: RenderDoubleTextAreaProps) => {
  return (
    <ObservationDoubleTextAreaComponent
      {...props.layoutProps!} //TODO: Remove ! when we get proper support for defaultProps in TS 3.0
      {...props.valueProps}
      disabled={props.disabled}
      leftLabel={I18n.t(`musit.observation.page.${props.type}.leftLabelText`)}
      leftTooltip={I18n.t(`musit.observation.page.${props.type}.leftLabelText`)}
      leftPlaceHolder={I18n.t(
        `musit.observation.page.${props.type}.leftLabelPlaceHolder`
      )}
      onChangeLeft={(value: TODO) =>
        props.onChangeField!('leftValue', value, props.index)
      } //Todo: Remove ! when we get proper support for defaultProps in TS 3.0
      rightLabel={I18n.t(`musit.observation.page.${props.type}.rightLabelText`)}
      rightTooltip={I18n.t(`musit.observation.page.${props.type}.rightLabelPlaceToolTip`)}
      rightPlaceHolder={I18n.t(
        `musit.observation.page.${props.type}.rightLabelPlaceHolder`
      )}
      onChangeRight={
        (value: TODO) => props.onChangeField!('rightValue', value, props.index) //Todo: Remove ! when we get proper support for defaultProps in TS 3.0
      }
    />
  );
};

export interface RenderDoubleTextAreaValueProp {
  leftValue: string;
  rightValue: string;
}

interface RenderDoubleTextAreaLayoutProps {
  leftWidth: number;
  rightWidth: number;
}

export interface RenderDoubleTextAreaProps {
  onChangeField?: OnChangeField; //Todo: Make required in TS 3.0, when we get proper support for defaultProps
  index?: number;
  valueProps: RenderDoubleTextAreaValueProp;

  layoutProps?: RenderDoubleTextAreaLayoutProps;
  type: string;
  disabled?: boolean;
}

(RenderDoubleTextArea as TODO_REMOVE).propTypes = {
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

const renderDoubleTextAreaDefaultProps: Partial<RenderDoubleTextAreaProps> = {
  layoutProps: {
    leftWidth: 5,
    rightWidth: 5
  },
  onChangeField: () => true
};

(RenderDoubleTextArea as TODO_REMOVE).defaultProps = renderDoubleTextAreaDefaultProps;

export const RenderFromToNumberComment = (props: RenderFromToNumberCommentProps) => {
  return (
    <ObservationFromToNumberCommentComponent
      {...props.layoutProps!}  //Todo: Remove ! in TS 3.0, when we get proper support for defaultProps
      {...props.valueProps}
      disabled={props.disabled}
      fromLabel={I18n.t(`musit.observation.page.${props.type}.fromValueLabelText`)}
      fromTooltip={I18n.t(`musit.observation.page.${props.type}.fromValueTooltip`)}
      fromPlaceHolder={I18n.t(
        `musit.observation.page.${props.type}.fromValuePlaceHolder`
      )}
      onChangeFrom={(value: TODO) =>
        props.onChangeField!('fromValue', value, props.index)
      } //Todo: Remove ! when we get proper support for defaultProps in TS 3.0
      toLabel={I18n.t(`musit.observation.page.${props.type}.toValueLabelText`)}
      toTooltip={I18n.t(`musit.observation.page.${props.type}.toValueTooltip`)}
      toPlaceHolder={I18n.t(`musit.observation.page.${props.type}.toValuePlaceHolder`)}
      onChangeTo={(value: TODO) => props.onChangeField!('toValue', value, props.index)} //Todo: Remove ! when we get proper support for defaultProps in TS 3.0
      commentLabel={I18n.t(`musit.observation.page.${props.type}.note`)}
      commentTooltip={I18n.t(`musit.observation.page.${props.type}.noteTooltip`)}
      commentPlaceholder={I18n.t(`musit.observation.page.${props.type}.notePlaceHolder`)}
      onChangeComment={
        (value: TODO) => props.onChangeField!('commentValue', value, props.index) //Todo: Remove ! when we get proper support for defaultProps in TS 3.0
      }
    />
  );
};

export interface RenderFromToNumberCommentValueProp {
  fromValue: string;
  toValue: string;
  commentValue: string;
}

interface RenderFromToNumberCommentLayoutProps {
  fromWidth: number;
  toWidth: number;
  commentWidth: number;
}

interface RenderFromToNumberCommentProps {
  onChangeField?: OnChangeField; //Todo: Make required in TS 3.0, when we get proper support for defaultProps

  index?: number;
  valueProps: RenderFromToNumberCommentValueProp;
  layoutProps?: RenderFromToNumberCommentLayoutProps; //Todo: Make required in TS 3.0, when we get proper support for defaultProps
  type: string;
  disabled?: boolean;
}

(RenderFromToNumberComment as TODO_REMOVE).propTypes = {
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

const renderFromToNumberCommentDefaultProps /*: Partial<RenderFromToNumberCommentProps>*/ = {
  layoutProps: {
    fromWidth: 3,
    toWidth: 3,
    commentWidth: 4
  },
  onChangeField: () => true
};

(RenderFromToNumberComment as TODO_REMOVE).defaultProps = renderFromToNumberCommentDefaultProps;
