// @flow
import keys from 'lodash/keys';
import type {
  AnalysisType,
  AnalysisCollection,
  ExtraResultAttributeValues,
  ExtraAttribute
} from '../../../types/analysis';
import type { FormData } from '../shared/formType';
import { I18n } from 'react-i18nify';
import type { Language } from '../../../types/appSession';
import toArray from 'lodash/toArray';
import { getAnalysisResultFieldAllowedValues } from './analysisResult';

export function getStatusText(status?: ?number): string {
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
    default:
      return 'N/A: ' + status;
  }
}

export function getLabPlaceText(
  analysisLabList: Array<{ id: number, fullName: string }>,
  actorId: ?number
): string {
  if (!actorId) {
    return '';
  }
  const lab = analysisLabList.find(x => x.id === actorId);
  if (!lab) {
    return '';
  }
  return lab.fullName;
}

export function getAnalysisPurpose(
  reason: ?string,
  purposes: ?Array<{ id: string, enPurpose: string, noPurpose: string }>,
  language: Language
) {
  if (reason && purposes) {
    const foundType = purposes.find(a => `${a.id}` === reason);
    if (foundType) {
      return language.isEn ? foundType.enPurpose : foundType.noPurpose;
    }
  }
  return '';
}

export function getAnalysisTypeTerm(
  analysisTypeId: ?number,
  analysisTypes: ?Array<AnalysisType>,
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
  analysisTypeId: ?number,
  analysisTypes: Array<AnalysisType>
): ?AnalysisType {
  return analysisTypeId ? analysisTypes.find(at => at.id === analysisTypeId) : null;
}

export function getExtraDescriptionAttributes(
  analysisType: ?AnalysisType,
  analysis: ?AnalysisCollection,
  extraDescriptionAttributes: any
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

type ExtraDescriptionAttributes = { [string]: any };

type ExtraDescriptionAttributesWithType = ExtraDescriptionAttributes & { type: string };

export function containsAttributes(
  extraDescriptionAttributes: ExtraDescriptionAttributes,
  existingAttributesFromBackend: ?ExtraDescriptionAttributesWithType
) {
  const newAttributes = keys(extraDescriptionAttributes)
    .filter(k => extraDescriptionAttributes[k])
    .reduce((acc, n) => ({ ...acc, [n]: extraDescriptionAttributes[n] }), {});

  const attributes = { ...existingAttributesFromBackend, ...newAttributes };

  return keys(attributes).length > 0;
}

export function getExtraResultAttributes(
  analysisType: ?AnalysisType,
  analysis: ?AnalysisCollection,
  extraResultAttributes: ?ExtraResultAttributeValues,
  language: Language
): ?ExtraResultAttributeValues {
  const initial = analysisType && analysisType.extraResultType
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
        const value = extraResultAttributes && extraResultAttributes[field]
          ? extraResultAttributes[field]
          : analysis ? getApiResult(field, type, analysis.result) : null;
        const allowedValues = getAnalysisResultFieldAllowedValues(
          extraResultType,
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
  type: ?string,
  result: any
): ?string | ?number | ?{ value: number, unit: string, rawValue: ?string } {
  const value = result && result[name];
  if (
    value &&
    type === 'Size' &&
    typeof value !== 'number' &&
    typeof value !== 'string'
  ) {
    if (value.value) {
      return {
        ...value,
        rawValue: value.value.toString().replace('.', ',')
      };
    }
    return value;
  }
  return value && value.toString();
}

export const getExtraDescriptionAttributesWithValue = (
  analysis: ?AnalysisCollection,
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

export const getAnalysisObjects = (form: FormData) =>
  form.type.value === 'AnalysisCollection'
    ? toArray(form.events.value)
    : [
        {
          term: form.term.value,
          museumNo: form.museumNo.value,
          subNo: form.subNo.value
        }
      ];
