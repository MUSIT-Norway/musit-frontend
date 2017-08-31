// @flow
import type { ObjectData } from '../../../types/object';
import type { SampleData } from '../../../types/samples';
export type SampleTypeInfo = { sampleType: string, sampleSubType: string };
export type ObjectWithSampleAndTypes = ObjectData & SampleData & SampleTypeInfo;
export type ObjectOrSample = ObjectWithSampleAndTypes | ObjectData;
