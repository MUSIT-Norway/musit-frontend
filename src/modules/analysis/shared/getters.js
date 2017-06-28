// @flow
import keys from 'lodash/keys';
import type {
  AnalysisType,
  AnalysisCollection,
  ExtraResultAttributeValues
} from '../../../types/analysisTypes';
import { I18n } from 'react-i18nify';
import type { Language } from '../../../types/appSession';

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
  return analysisTypes && analysisTypes.find(at => at.id === analysisTypeId);
}

export function getExtraDescriptionAttributes(
  analysisType: ?AnalysisType,
  analysis: ?AnalysisCollection,
  extraDescriptionAttributes: any
) {
  const extraDescriptionAttributesType = analysisType
    ? analysisType.extraDescriptionType
    : analysis && analysis.extraAttributes && analysis.extraAttributes.type;

  return extraDescriptionAttributesType
    ? {
        ...(analysis && analysis.extraAttributes),
        ...extraDescriptionAttributes,
        type: extraDescriptionAttributesType
      }
    : null;
}

export function getExtraResultAttributes(
  analysisType: ?AnalysisType,
  analysis: ?AnalysisCollection,
  extraResultAttributes: ?ExtraResultAttributeValues
): ?ExtraResultAttributeValues {
  const initial = analysisType && analysisType.extraResultType
    ? {
        type: analysisType.extraResultType
      }
    : {};
  return analysisType && analysisType.extraResultAttributes
    ? keys(analysisType.extraResultAttributes).reduce((acc, era) => {
        const type =
          analysisType &&
          analysisType.extraResultAttributes &&
          analysisType.extraResultAttributes[era];
        const value = extraResultAttributes && extraResultAttributes[era]
          ? extraResultAttributes[era]
          : analysis ? getApiResult(era, type, analysis.result) : null;
        return {
          ...acc,
          [era]: {
            type,
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
