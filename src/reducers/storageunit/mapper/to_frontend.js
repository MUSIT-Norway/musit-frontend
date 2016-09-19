import { formatFloatToString } from '../../../util'

export const toFrontend = (data) => {
  return {
    ...data,
    area: formatFloatToString(data.area),
    areaTo: formatFloatToString(data.areaTo),
    height: formatFloatToString(data.height),
    heightTo: formatFloatToString(data.heightTo),
    environmentRequirement: data.environmentRequirement ? { ...data.environmentRequirement,
      temperature: formatFloatToString(data.environmentRequirement.temperature),
      temperatureTolerance: formatFloatToString(data.environmentRequirement.temperatureTolerance),
      hypoxicAir: formatFloatToString(data.environmentRequirement.hypoxicAir),
      hypoxicAirTolerance: formatFloatToString(data.environmentRequirement.hypoxicAirTolerance),
      relativeHumidity: formatFloatToString(data.environmentRequirement.relativeHumidity),
      relativeHumidityTolerance: formatFloatToString(data.environmentRequirement.relativeHumidityTolerance)
    } : {},
    environmentAssessment: data.environmentAssessment || {},
    securityAssessment: data.securityAssessment || {}
  }
}
