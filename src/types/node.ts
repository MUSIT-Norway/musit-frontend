// @flow

export type NodeStats = {
  numNodes: number,
  numObjects: number,
  totalObjects: number
};

export type PathName = {
  nodeId: number,
  nodeUuid: string,
  name: string
};

export type Interval<T> = {
  base: T,
  tolerance: ?number
};

export type EnvironmentRequirement = {
  temperature: ?Interval<number>,
  relativeHumidity: ?Interval<number>,
  hypoxicAir: ?Interval<number>,
  cleaning: ?string,
  lightingCondition: ?string,
  comment: ?string
};

export type Node = {
  id: number,
  nodeId: string,
  name: string,
  area: ?number,
  areaTo: ?number,
  isPartOf: ?number,
  height: ?number,
  heightTo: ?number,
  groupRead: ?string,
  groupWrite: ?string,
  path: string,
  pathNames: ?Array<PathName>,
  environmentRequirement: ?EnvironmentRequirement,
  storageType: string,
  updatedBy: ?string,
  updatedDate: ?string
};
