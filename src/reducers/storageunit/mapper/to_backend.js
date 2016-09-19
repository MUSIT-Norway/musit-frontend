import { parseFloatFromString } from '../../../util'

export const toBackend = (data, parentId) => {
  return {
    ...data,
    groupRead: 'foo', // Must be removed
    isPartOf: parentId ? parentId * 1 : data.isPartOf,
    area: parseFloatFromString(data.area),
    areaTo: parseFloatFromString(data.areaTo),
    height: parseFloatFromString(data.height),
    heightTo: parseFloatFromString(data.heightTo),
    environmentRequirement: data.environmentRequirement ? { ...data.environmentRequirement,
      temperature: parseFloatFromString(data.environmentRequirement.temperature),
      temperatureTolerance: parseFloatFromString(data.environmentRequirement.temperatureTolerance),
      hypoxicAir: parseFloatFromString(data.environmentRequirement.hypoxicAir),
      hypoxicAirTolerance: parseFloatFromString(data.environmentRequirement.hypoxicAirTolerance),
      relativeHumidity: parseFloatFromString(data.environmentRequirement.relativeHumidity),
      relativeHumidityTolerance: parseFloatFromString(data.environmentRequirement.relativeHumidityTolerance)
    } : {},
    environmentAssessment: data.environmentAssessment || {},
    securityAssessment: data.securityAssessment || {}
  }
}
