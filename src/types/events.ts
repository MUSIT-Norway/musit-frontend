// @flow

export type breadcrumb = {
  id: string;
  name: string;
  nodeId: string;
  url: string;
};

export type pathNames = {
  name: string;
  nodeId: number;
  nodeUuid: string;
};

export type Event = {
  id: number;
  eventTypeId: number;
  eventDate: string;
  doneBy: string;
  doneDate: string;
  registeredDate: string;
  registeredBy: string;
  type: string;
  keyData: string;
  enKeyData?: Array<string>;
  noKeyData?: Array<string>;
  note: string;
  caseNumbers: Array<string>;
  analysisTypeId: number;
  sampleTypeId: number;
  to: {
    breadcrumb: breadcrumb[];
    path: string;
    pathNames: pathNames[];
  };
};

export type Events = Event[];
