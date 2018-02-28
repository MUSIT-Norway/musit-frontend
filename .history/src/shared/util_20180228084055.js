// @flow
import React from "react";
import moment from "moment";
import { Observable } from "rxjs";
import type { PathName } from "types/node";
import type { AppSession } from "/types/appSession";

export const toPromise = (fn: (val: *) => Observable<*>) => (val: *) =>
  fn(val).toPromise();

export const flatten = (arr: Array<*>) => {
  const obj = {};

  for (let i = 0; i < arr.length; i++) {
    Object.keys(arr[i]).forEach(x => {
      obj[x] = arr[i][x];
    });
  }

  return obj;
};

export const filter = (
  arr: Array<*>,
  fields: Array<string>,
  pattern: string
) => {
  const contains = (s: *, p: string) => {
    return (
      (s || "")
        .toString()
        .toLowerCase()
        .indexOf(p.toLowerCase()) !== -1
    );
  };
  return arr.filter(row => {
    return fields.find(field => contains(row[field], pattern));
  });
};

export const getDisplayName = (Component: React.Component<*, *>) => {
  return Component.displayName || Component.name || "Component";
};

export const blur = () => {
  // Give the document focus
  window.focus();

  // Remove focus from any focused element
  if (document.activeElement) {
    document.activeElement.blur();
  }
};

export const containsObjectWithField = (
  arr: Array<*>,
  field: string,
  value: string
): boolean => arr.filter(e => e[field] === value).length > 0;

export const DATE_FORMAT_DISPLAY = "DD.MM.YYYY";

export const parseUTCDate = (dateStr: string) => {
  return moment.utc(dateStr);
};

export const parseISODate = (dateStr: string) => {
  return moment(new Date(dateStr));
};
export const formatISOString = (d: Date) => {
  return moment(d).format("YYYY-MM-DDT00:00:00.000Z");
};

export const parseFloatFromString = (value: string): number => {
  return typeof value === "string"
    ? window.parseFloat(value.replace(",", "."))
    : value;
};

export const formatFloatToString = (number: number): string => {
  return typeof number === "number"
    ? number.toString().replace(".", ",")
    : number;
};

export const hasProp = (obj: *, prop: string): boolean => {
  return {}.hasOwnProperty.call(obj, prop);
};

export const customSortingStorageNodeType = (type: string): string => {
  switch (type) {
    case "Organisation":
      return "01";
    case "Building":
      return "02";
    case "Room":
      return "03";
    case "StorageUnit":
      return "04";
    default:
      return "99";
  }
};

export const isDateBiggerThanToday = (newDate: string | number): boolean => {
  const today = moment();
  const isAfterYear = moment(newDate).isAfter(today, "year");
  const isAfterMonth = moment(newDate).isAfter(today, "month");
  const isAfterDay = moment(newDate).isAfter(today, "day");
  return isAfterDay || isAfterMonth || isAfterYear;
};

export class Option {
  value = null;

  constructor(value: *) {
    this.value = value;
  }

  map<U>(func: (a: *) => U): ?U {
    if (this.value == null) {
      return; // return undefined/void
    }
    return func(this.value);
  }
}

const testing = process.env.NODE_ENV === "test";

export const apiUrl = (url: string): string => {
  return `${testing ? "http://localhost" : ""}${url}`;
};

export type SomethingLikeNode = {
  id: number,
  nodeId: string,
  name: string,
  path: string,
  pathNames: Array<PathName>
};

export const getPath = (node: SomethingLikeNode) => {
  if (!node) {
    return [];
  }
  const nodeIds = (node.path || "")
    .split(",")
    .slice(1)
    .map(p => parseFloat(p))
    .filter(n => n);
  const pathNames = node.pathNames || [
    {
      nodeId: node.id,
      nodeUuid: node.nodeId,
      name: node.name
    }
  ];
  return nodeIds.map(nodeIntId => {
    let pathMatch = pathNames.find(e => e.nodeId === nodeIntId);
    if (!pathMatch) {
      pathMatch = {
        nodeId: node.nodeId,
        nodeUuid: node.nodeId,
        name: node.name
      };
    }
    return {
      id: pathMatch.nodeUuid,
      nodeId: pathMatch.nodeUuid,
      name: pathMatch.name,
      url: "/magasin/" + pathMatch.nodeUuid
    };
  });
};

export const musitParseFloat = (txt: string) => {
  if (txt) {
    if (txt.length === 1) {
      if (isNaN(parseInt(txt))) return "";
      else return txt;
    } else {
      const res = txt.replace(",", ".");
      const extraTxt = res.endsWith(".") ? "." : "";
      return parseFloat(res) + extraTxt;
    }
  }
  return undefined;
};

export const musitParseInt = (txt: string) => {
  if (txt) {
    if (txt.length === 1) {
      if (isNaN(parseInt(txt))) return "";
      else return txt;
    } else {
      return parseInt(txt);
    }
  }
  return undefined;
};

// constant for eventTypeId

export const conservationProcessTypeId = 1;
export const treatmentTypeId = 2;
export const technicalDescriptionTypeId = 3;
export const storageAndHandlingTypeId = 4;
export const HseRiskAssessmentTypeId = 5;
export const conditionAssessmentTypeId = 6;
export const reportTypeId = 7;
export const materialDeterminationTypeId = 8;
export const measurementDeterminationTypeId = 9;
export const NoteTypeId = 10;

// "collections"
export const algaeCollectionUuid = "1d8dd4e6-1527-439c-ac86-fc315e0ce852";
export const ArchaeologyCollectionUuid = "2e4f2455-1b3b-4a04-80a1-ba92715ff613";
export const EntomologyCollectionUuid = "ba3d4d30-810b-4c07-81b3-37751f2196f0";
export const EthnographyCollectionUuid = "88b35138-24b5-4e62-bae4-de80fae7df82";
export const VascularPlantsCollectionUuid =
  "7352794d-4973-447b-b84e-2635cafe910a";
export const LichensCollectionUuid = "fcb4c598-8b05-4095-ac00-ce66247be38a";
export const MarineInvertebratesCollectionUuid =
  "ef4dc066-b6f8-4155-89f8-7aa9aeeb2dc4";
export const BryophyteCollectionUuid = "d0dd5ad3-c22f-4ea0-8b52-dc5b0e17aa24";
export const NumismaticCollectionUuid = "8bbdf9b3-56d1-479a-9509-2ea82842e8f8";
export const FungiCollectionUuid = "23ca0166-5f9e-44c2-ab0d-b4cdd704af07";
export const AllCollectionUuid = "00000000-0000-0000-0000-000000000000";

export const getCultureOrNatureUnit = (appSession: AppSession) => {
  if (appSession) {
    const collectionId = appSession.collectionId;
    const culture = [
      ArchaeologyCollectionUuid,
      EthnographyCollectionUuid,
      NumismaticCollectionUuid
    ];
    if (culture.includes(collectionId)) return " cm";
    else return " mm";
  } else return " cm";
};
