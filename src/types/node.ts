import { Maybe } from './common';

// @flow

export type NodeStats = {
  numNodes: number;
  numObjects: number;
  totalObjects: number;
};

export type PathName = {
  nodeId: number;
  nodeUuid: string;
  name: string;
};

export type Interval<T> = {
  base: T;
  tolerance: Maybe<number>;
};

export type EnvironmentRequirement = {
  temperature: Maybe<Interval<number>>;
  relativeHumidity: Maybe<Interval<number>>;
  hypoxicAir: Maybe<Interval<number>>;
  cleaning: Maybe<string>;
  lightingCondition: Maybe<string>;
  comment: Maybe<string>;
};

export interface Node {
  id: number;
  nodeId: string;
  name: string;
  area: Maybe<number>;
  areaTo: Maybe<number>;
  isPartOf: Maybe<number>;
  height: Maybe<number>;
  heightTo: Maybe<number>;
  groupRead: Maybe<string>;
  groupWrite: Maybe<string>;
  path: string;
  pathNames: Maybe<Array<PathName>>;
  environmentRequirement: Maybe<EnvironmentRequirement>;
  storageType: string;
  updatedBy: Maybe<string>;
  updatedDate: Maybe<string>;
  type?: string;
}
