// @flow
import { keys } from 'lodash';
import {
  AnalysisType,
  AnalysisEvent,
  AnalysisCollection,
  ExtraResultAttributeValues,
  ExtraAttribute,
  Result
} from '../../../types/analysis';
import { I18n } from 'react-i18nify';
import { Language } from '../../../types/appSession';
import { AnalysisLab, Purpose } from '../../../types/predefined';
import { getAnalysisResultFieldAllowedValues } from './analysisResult';
import { Maybe, Star, MUSTFIX, TODO } from '../../../types/common';

export function getStatusText(status?: Maybe<number>): string {
  if (!status) {
    return '';
  }
  switch (status) {
    case 1:
      return I18n.t('musit.analysis.statusType.1');
    case 2:
      return I18n.t('musit.analysis.statusType.2');
    case 3:
      return I18n.t('musit.analysis.statusType.3');
    case 4:
      return I18n.t('musit.analysis.statusType.4');
    case -1:
      return 'Annet';
    default:
      return 'N/A: ' + status;
  }
}

export type Value = { rawValue?: Maybe<string>; value?: Maybe<number> };

export function parseValue(value: Value): Value {
  return typeof value.rawValue !== 'undefined'
    ? {
        ...value,
        value: value.rawValue ? parseFloat(value.rawValue.replace(',', '.')) : null
      }
    : value;
}

export function getLabPlaceText(
  analysisLabList: Maybe<Array<AnalysisLab>>,
  actorId: Maybe<number>
): string {
  if (!actorId || !analysisLabList) {
    return '';
  }
  const lab = analysisLabList.find(x => x.id === actorId);
  if (!lab) {
    return '';
  }
  return lab.fullName;
}

export function getAnalysisPurpose(
  reason: Maybe<string>,
  purposes: Maybe<Array<Purpose>>,
  language: Language
): string {
  if (reason && purposes) {
    const foundType = purposes.find(a => `${a.id}` === reason);
    if (foundType) {
      return language.isEn ? foundType.enPurpose : foundType.noPurpose;
    }
  }
  return reason || '';
}

export function getAnalysisTypeTerm(
  analysisTypeId: Maybe<number>,
  analysisTypes: Maybe<Array<AnalysisType>>,
  language: Language
): string {
  if (analysisTypeId && analysisTypes) {
    const foundType = analysisTypes.find(type => type.id === analysisTypeId);
    if (foundType) {
      return language.isEn ? foundType.enName : foundType.noName;
    }
  }
  return '';
}

export function getAnalysisType(
  analysisTypeId: Maybe<number>,
  analysisTypes: Maybe<Array<AnalysisType>>
): Maybe<AnalysisType> {
  return analysisTypeId && analysisTypes
    ? analysisTypes.find(at => at.id === analysisTypeId)
    : null;
}

export function getExtraDescriptionAttributes(
  analysisType: Maybe<AnalysisType>,
  analysis: Maybe<AnalysisCollection>,
  extraDescriptionAttributes: Star
) {
  const extraDescriptionAttributesType = analysisType
    ? analysisType.extraDescriptionType
    : analysis && analysis.extraAttributes && analysis.extraAttributes.type;

  const initialExtraDescriptionAttributes =
    analysisType &&
    analysisType.extraDescriptionAttributes &&
    analysisType.extraDescriptionAttributes.reduce(
      (acc, eda) => ({
        ...acc,
        [eda.attributeKey]: eda.attributeType === 'String' ? '' : null
      }),
      {}
    );

  const existingAttributesFromBackend = analysis && analysis.extraAttributes;

  return extraDescriptionAttributesType &&
  containsAttributes(extraDescriptionAttributes, existingAttributesFromBackend)
    ? {
        ...initialExtraDescriptionAttributes,
        ...existingAttributesFromBackend,
        ...extraDescriptionAttributes,
        type: extraDescriptionAttributesType
      }
    : null;
}

type ExtraDescriptionAttributes = { type: string; [key: string]: string | number };

type ExtraDescriptionAttributesWithType = ExtraDescriptionAttributes & { type: string };

export function containsAttributes(
  extraDescriptionAttributes: ExtraDescriptionAttributes,
  existingAttributesFromBackend: Maybe<ExtraDescriptionAttributesWithType>
) {
  const newAttributes = keys(extraDescriptionAttributes)
    .filter(k => extraDescriptionAttributes[k])
    .reduce((acc, n) => ({ ...acc, [n]: extraDescriptionAttributes[n] }), {});

  const attributes = { ...existingAttributesFromBackend, ...newAttributes };

  return keys(attributes).length > 0;
}

export function getExtraResultAttributes(
  analysisType: Maybe<AnalysisType>,
  analysis: Maybe<AnalysisCollection>,
  extraResultAttributes: Maybe<ExtraResultAttributeValues>,
  language: Language
): Maybe<ExtraResultAttributeValues> {
  const initial =
    analysisType && analysisType.extraResultType
      ? {
          type: analysisType.extraResultType
        }
      : {};
  const extraResultType = initial.type;
  return analysisType && analysisType.extraResultAttributes
    ? keys(analysisType.extraResultAttributes).reduce((acc, field) => {
        const type =
          analysisType &&
          analysisType.extraResultAttributes &&
          analysisType.extraResultAttributes[field];
        const value =
          extraResultAttributes && extraResultAttributes[field]
            ? extraResultAttributes[field]
            : analysis ? getApiResult(field, type, analysis.result) : null;
        const allowedValues = getAnalysisResultFieldAllowedValues(
          extraResultType as MUSTFIX,
          field,
          language
        );
        return {
          ...acc,
          [field]: {
            type,
            allowedValues,
            value
          }
        };
      }, initial)
    : null;
}

export function getApiResult(
  name: string,
  type: Maybe<string>,
  result: Maybe<Result>
):
  | Maybe<string>
  | Maybe<number>
  | Maybe<{ value: number; unit: string; rawValue: Maybe<string> }> {
  const value = result && result[name];
  if (
    value &&
    type === 'Size' &&
    typeof value !== 'number' &&
    typeof value !== 'string'
  ) {
    if ((value as TODO).value) {
      return {
        ...value as TODO,
        rawValue: (value as TODO).value.toString().replace('.', ',')
      };
    }
  }
  return value && value.toString();
}

export const getExtraDescriptionAttributesWithValue = (
  analysis: Maybe<AnalysisCollection>,
  extraDescriptionAttributes: Array<ExtraAttribute>,
  language: Language
) =>
  extraDescriptionAttributes.map(attr => {
    let attributeValue =
      analysis && analysis.extraAttributes && analysis.extraAttributes[attr.attributeKey];
    if (attr.allowedValues) {
      const selected = attr.allowedValues.find(av => av.id === attributeValue);
      if (selected) {
        if (language.isEn) {
          attributeValue = selected.enLabel;
        }
        attributeValue = selected.noLabel;
      }
    }
    return { ...attr, attributeValue };
  });

export function getParentObjectId(analysisEvent: AnalysisEvent): Maybe<string> {
  return analysisEvent.sampleData && analysisEvent.sampleData.originatedObjectUuid
    ? analysisEvent.sampleData.originatedObjectUuid
    : analysisEvent.objectData ? analysisEvent.objectData.uuid : null;
}
