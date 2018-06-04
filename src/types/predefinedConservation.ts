// @flow
import { ConservationTypes, ConservatonSubType, ConditionCodeType } from "./conservation";
import { SampleType } from "./sample";
import { Maybe } from "./common";

export type SampleTypes = {
  [key: string]: Array<SampleType>;
  raw: Array<SampleType>;
};

export interface PredefinedConservation {
  sampleTypes: Maybe<SampleTypes>;
  conservationTypes: Maybe<ConservationTypes>;
  materialList: Maybe<Array<ConservatonSubType>>;
  keywordList: Maybe<Array<ConservatonSubType>>;
  roleList: Maybe<Array<ConservatonSubType>>;
  conditionCodeList: Maybe<Array<ConditionCodeType>>;
  materialDeterminationList: Maybe<Array<any>>;

  loadingSampleTypes: boolean; //?
  loadingConservationTypes: boolean //?
}
