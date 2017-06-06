import { formatFloatToString, getPath } from '../../../shared/util';

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

export const toFrontend = data => {
  return {
    ...data,
    breadcrumb: getPath(data),
    area: formatFloatToString(data.area),
    areaTo: formatFloatToString(data.areaTo),
    height: formatFloatToString(data.height),
    heightTo: formatFloatToString(data.heightTo),
    environmentRequirement: data.environmentRequirement
      ? {
          cleaning: data.environmentRequirement.cleaning,
          lightingCondition: data.environmentRequirement.lightingCondition,
          comments:
            data.environmentRequirement.comment || data.environmentRequirement.comments,
          ...mapRequirement(data.environmentRequirement, 'temperature'),
          ...mapRequirement(data.environmentRequirement, 'hypoxicAir'),
          ...mapRequirement(data.environmentRequirement, 'relativeHumidity')
        }
      : {},
    environmentAssessment: data.environmentAssessment || {},
    securityAssessment: data.securityAssessment || {}
  };
};
