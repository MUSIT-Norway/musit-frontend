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
  nodeId?: string;
  name?: string;
  area?: number | null;
  areaTo?: number | null;
  isPartOf?: number | null;
  height?: number | null;
  heightTo?: number | null;
  groupRead?: string | null;
  groupWrite?: string | null;
  path?: string;
  pathNames?: PathName[] | null;
  environmentRequirement?: EnvironmentRequirement | null;
  storageType?: string;
  updatedBy?: string | null;
  updatedDate?: string | null;
  type?: string;
  museumId?: number;
  token?: string;
}
