import { parseFloatFromString } from '../../../shared/util';
import { TODO } from '../../../types/common';

export const toBackend = (data: TODO, parentId?: TODO) => {
  return {
    ...data,
    groupRead: 'foo', //TODO: Must be removed
    isPartOf: parentId ? parentId * 1 : data.isPartOf,
    area: parseFloatFromString(data.area),
    areaTo: parseFloatFromString(data.areaTo),
    height: parseFloatFromString(data.height),
    heightTo: parseFloatFromString(data.heightTo),
    environmentRequirement: data.environmentRequirement
      ? {
          cleaning: data.environmentRequirement.cleaning,
          lightingCondition: data.environmentRequirement.lightingCondition,
          comment: data.environmentRequirement.comments,
          temperature: data.environmentRequirement.temperature && {
            base: parseFloatFromString(data.environmentRequirement.temperature),
            tolerance: parseFloatFromString(
              data.environmentRequirement.temperatureTolerance
            )
          },
          hypoxicAir: data.environmentRequirement.hypoxicAir && {
            base: parseFloatFromString(data.environmentRequirement.hypoxicAir),
            tolerance: parseFloatFromString(
              data.environmentRequirement.hypoxicAirTolerance
            )
          },
          relativeHumidity: data.environmentRequirement.relativeHumidity && {
            base: parseFloatFromString(data.environmentRequirement.relativeHumidity),
            tolerance: parseFloatFromString(
              data.environmentRequirement.relativeHumidityTolerance
            )
          }
        }
      : {},
    environmentAssessment: data.environmentAssessment || null,
    securityAssessment: data.securityAssessment || null
  };
};
