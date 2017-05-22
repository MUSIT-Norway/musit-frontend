// @flow

type EventData = {
  id: number,
  eventDate: string,
  doneBy: string,
  doneDate: string,
  registeredDate: string,
  registeredBy: string,
  type: string,
  keyData: string,
  note: string,
  caseNumbers: Array<string>,
  analysisTypeId: number,
  sampleTypeId: number
};

export type Events = EventData[];
