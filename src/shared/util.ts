// @flow
import * as React from 'react';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { PathName } from '../types/node';
import { AppSession } from '../types/appSession';
import { Star, Maybe, MUSTFIX } from '../types/common';

export const toPromise = (fn: (val: Star) => Observable<Star>) => (val: Star) =>
  fn(val).toPromise();

export const flatten = (arr: Array<Star>) => {
  const obj = {};

  for (let i = 0; i < arr.length; i++) {
    Object.keys(arr[i]).forEach(x => {
      obj[x] = arr[i][x];
    });
  }

  return obj;
};

export const filter = (arr: Array<Star>, fields: Array<string>, pattern: string) => {
  const contains = (s: Star, p: string) => {
    return (
      (s || '')
        .toString()
        .toLowerCase()
        .indexOf(p.toLowerCase()) !== -1
    );
  };
  return arr.filter(row => {
    return fields.find(field => contains(row[field], pattern));
  });
};

export const getDisplayName = (Component: React.SFC<any>) => {
  return Component.displayName || Component.name || 'Component';
};
/* I changed the above to SFC instead of Component, as Component isn't supposed to have displayname nor name.
Do something else if non-SFCs are used as argument to the above function.

export const getDisplayName = (Component: React.Component<Star, Star>) => {
  return Component.displayName || Component.name || 'Component';
};

*/
export const blur = () => {
  // Give the document focus
  window.focus();

  // Remove focus from any focused element
  if (document.activeElement) {
    (document.activeElement as HTMLElement).blur();
  }
};

export const containsObjectWithField = (
  arr: Array<Star>,
  field: string,
  value: string
): boolean => arr.filter(e => e[field] === value).length > 0;

export const DATE_FORMAT_DISPLAY = 'DD.MM.YYYY';

export const parseUTCDate = (dateStr: string) => {
  return moment.utc(dateStr);
};

export const parseISODate = (dateStr: string) => {
  return moment(new Date(dateStr));
};
export const formatISOString = (d: Date | string) => {
  return moment(d).format('YYYY-MM-DDT00:00:00.000Z');
};

export const maybeFormatISOString = (d?: Date | string) => {
  return d ? formatISOString(d) : d;
  // moment(d).format('YYYY-MM-DDT00:00:00.000Z');
};

export const parseFloatFromString = (value: string): number => {
  return typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
};

export const formatFloatToString = (number: number): string => {
  return typeof number === 'number' ? number.toString().replace('.', ',') : number;
};

export const hasProp = (obj: Star, prop: string): boolean => {
  return {}.hasOwnProperty.call(obj, prop);
};

export const customSortingStorageNodeType = (type: string): string => {
  switch (type) {
    case 'Organisation':
      return '01';
    case 'Building':
      return '02';
    case 'Room':
      return '03';
    case 'StorageUnit':
      return '04';
    default:
      return '99';
  }
};

export const isDateBiggerThanToday = (newDate: string | number): boolean => {
  const today = moment();
  const isAfterYear = moment(newDate).isAfter(today, 'year');
  const isAfterMonth = moment(newDate).isAfter(today, 'month');
  const isAfterDay = moment(newDate).isAfter(today, 'day');
  return isAfterDay || isAfterMonth || isAfterYear;
};

export class Option {
  value = null;

  constructor(value: Star) {
    this.value = value;
  }

  map<U>(func: (a: Star) => U): Maybe<U> {
    if (this.value == null) {
      return; // return undefined/void
    }
    return func(this.value);
  }
}

const testing = process.env.NODE_ENV === 'test';

export const apiUrl = (url: string): string => {
  return `${testing ? 'http://localhost' : ''}${url}`;
};

export type SomethingLikeNode = {
  id: number;
  nodeId: string;
  name: string;
  path: string;
  pathNames: Array<PathName>;
};

export const getPath = (node: SomethingLikeNode) => {
  if (!node) {
    return [];
  }
  const nodeIds = (node.path || '')
    .split(',')
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
        nodeId: node.nodeId as MUSTFIX, //TODO: The code is confusing regarding
        // whether nodeIs is a number or string. Please remove/fix this confusion!
        nodeUuid: node.nodeId,
        name: node.name
      };
    }
    return {
      id: pathMatch.nodeUuid,
      nodeId: pathMatch.nodeUuid,
      name: pathMatch.name,
      url: '/magasin/' + pathMatch.nodeUuid
    };
  });
};

export const musitParseFloat = (txt: string) => {
  if (!txt) return undefined;
  if (txt.length === 1) {
    if (isNaN(parseInt(txt))) return '';
    else return txt;
  }

  const res = txt.replace(',', '.');

  const reg = /(.*?)(0*)$/;
  const svar = reg.exec(res);
  if (svar) {
    const endNulls = svar[2];
    let startTxt = svar[1];
    const maybeDot = startTxt.endsWith('.') ? '.' : '';
    /*  console.log('svaret er : ' + svar); */
    if (startTxt) startTxt = parseFloat(startTxt).toString();

    return startTxt + maybeDot + endNulls;
  } else
    throw new Error(
      'Internal error, unexpected result on regular expression in musitParseFloat'
    );
};

export const musitParseInt = (txt: string) => {
  if (txt) {
    if (txt.length === 1) {
      if (isNaN(parseInt(txt))) return '';
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
export const hseRiskAssessmentTypeId = 5;
export const conditionAssessmentTypeId = 6;
export const reportTypeId = 7;
export const materialDeterminationTypeId = 8;
export const measurementDeterminationTypeId = 9;
export const noteTypeId = 10;

// "collections"
export const algaeCollectionUuid = '1d8dd4e6-1527-439c-ac86-fc315e0ce852';
export const archaeologyCollectionUuid = '2e4f2455-1b3b-4a04-80a1-ba92715ff613';
export const entomologyCollectionUuid = 'ba3d4d30-810b-4c07-81b3-37751f2196f0';
export const ethnographyCollectionUuid = '88b35138-24b5-4e62-bae4-de80fae7df82';
export const vascularPlantsCollectionUuid = '7352794d-4973-447b-b84e-2635cafe910a';
export const lichensCollectionUuid = 'fcb4c598-8b05-4095-ac00-ce66247be38a';
export const marineInvertebratesCollectionUuid = 'ef4dc066-b6f8-4155-89f8-7aa9aeeb2dc4';
export const bryophyteCollectionUuid = 'd0dd5ad3-c22f-4ea0-8b52-dc5b0e17aa24';
export const numismaticCollectionUuid = '8bbdf9b3-56d1-479a-9509-2ea82842e8f8';
export const fungiCollectionUuid = '23ca0166-5f9e-44c2-ab0d-b4cdd704af07';
export const allCollectionUuid = '00000000-0000-0000-0000-000000000000';

export const getCultureOrNatureUnit = (appSession?: AppSession) => {
  if (appSession) {
    const collectionId = appSession.collectionId;
    const culture = [
      archaeologyCollectionUuid,
      ethnographyCollectionUuid,
      numismaticCollectionUuid
    ];
    if (culture.includes(collectionId)) return '(cm)';
    else return '(mm)';
  } else return '(undefined)';
};

export const styleWidth = (pixels: number) => ({ width: pixels });
export const styleWidth10 = styleWidth(10);

export const musitCoodinateValidate = (coordinateType?: string) => (value: string) => {
  if (coordinateType === 'MGRS') {
    const coorRegexMGRS1 = new RegExp(
      /^[A-Z]{2}(-[A-Z]{2})?\s((\d{1}(-\d{1})?,\d{1}(-\d{1})?)|(\d{2}(-\d{2})?,\d{2}(-\d{2})?)|(\d{3}(-\d{3})?,\d{3}(-\d{3})?)|(\d{4}(-\d{4})?,\d{4}(-\d{4})?)||(\d{5}(-\d{5})?,\d{5}(-\d{5})?))$/,
      'i'
    ); // LL-LK 234-345, 234-456
    //    const coorRegexMGRS2 = new RegExp(/^[A-Z]{2}(\d{2}|\d{4}|\d{6}|\d{8}|\d{10})$/, 'i'); //LL2345656789
    if (coorRegexMGRS1.test(value)) {
      return true;
    } else {
      return false;
    }
  }
  if (coordinateType === 'LAT/LONG') {
    const r1 = new RegExp(/^\d+(\s+\d+(\s+\d+)?)?(N|S)\s+\d+(\s+\d+(\s+\d+)?)?(E|W)$/);
    const r2 = new RegExp(/^\-?\d+(\.\d+)?\s+\-?\d+(\.\d+)?$/);
    return r1.test(value) || r2.test(value);
  }

  if (coordinateType === 'UTM') {
    const r1 = new RegExp(/^\d+(\s+|\,)\d+$/);
    return r1.test(value);
  }
  return true;
};

export const validatePositiveInteger = (count: string) => {
  const intRegex = new RegExp(/^\d+$/);
  if (count === '') {
    return true;
  } else {
    if (intRegex.test(count)) {
      return true;
    } else {
      return false;
    }
  }
};
