import { parseFloatFromString, formatFloatToString, getPath } from '../../util';

const mapRequirement = (envReq, field) => {
  if (envReq[field] && (envReq[field].base || envReq[field].tolerance)) {
    return {
      [field]: formatFloatToString(envReq[field].base),
      [`${field}Tolerance`]: formatFloatToString(envReq[field].tolerance)
    };
  }
  if (envReq[field] || envReq[`${field}Tolerance`]) {
    return {
      [field]: formatFloatToString(envReq[field]),
      [`${field}Tolerance`]: formatFloatToString(envReq[`${field}Tolerance`])
    };
  }
  return null;
};

export const toFrontend = (data) => {
  return {
    ...data,
    breadcrumb: getPath(data),
    area: formatFloatToString(data.area),
    areaTo: formatFloatToString(data.areaTo),
    height: formatFloatToString(data.height),
    heightTo: formatFloatToString(data.heightTo),
    environmentRequirement: data.environmentRequirement ? {
      cleaning: data.environmentRequirement.cleaning,
      lightingCondition: data.environmentRequirement.lightingCondition,
      comments: data.environmentRequirement.comment || data.environmentRequirement.comments,
      ...mapRequirement(data.environmentRequirement, 'temperature'),
      ...mapRequirement(data.environmentRequirement, 'hypoxicAir'),
      ...mapRequirement(data.environmentRequirement, 'relativeHumidity')
    } : {},
    environmentAssessment: data.environmentAssessment || {},
    securityAssessment: data.securityAssessment || {}
  };
};

export const toBackend = (data, parentId) => {
  return {
    ...data,
    groupRead: 'foo', // Must be removed
    isPartOf: parentId ? parentId * 1 : data.isPartOf,
    area: parseFloatFromString(data.area),
    areaTo: parseFloatFromString(data.areaTo),
    height: parseFloatFromString(data.height),
    heightTo: parseFloatFromString(data.heightTo),
    environmentRequirement: data.environmentRequirement ? {
      cleaning: data.environmentRequirement.cleaning,
      lightingCondition: data.environmentRequirement.lightingCondition,
      comment: data.environmentRequirement.comments,
      temperature: data.environmentRequirement.temperature && {
        base: parseFloatFromString(data.environmentRequirement.temperature),
        tolerance: parseFloatFromString(data.environmentRequirement.temperatureTolerance)
      },
      hypoxicAir: data.environmentRequirement.hypoxicAir && {
        base: parseFloatFromString(data.environmentRequirement.hypoxicAir),
        tolerance: parseFloatFromString(data.environmentRequirement.hypoxicAirTolerance)
      },
      relativeHumidity: data.environmentRequirement.relativeHumidity && {
        base: parseFloatFromString(data.environmentRequirement.relativeHumidity),
        tolerance: parseFloatFromString(data.environmentRequirement.relativeHumidityTolerance)
      }
    } : {},
    environmentAssessment: data.environmentAssessment || null,
    securityAssessment: data.securityAssessment || null
  };
};
