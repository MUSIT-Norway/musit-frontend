// @flow

type EventData = {
  id: number,
  eventDate: string,
  doneBy: string,
  registeredBy: string,
  type: string,
  keyData: string,
  note: string
};

export type Events = EventData[];
