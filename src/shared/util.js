/* @flow */
import React from 'react';
import moment from 'moment';

export const flatten = (arr: []) => {
  const obj = {};

  for (let i = 0; i < arr.length; i++) {
    Object.keys(arr[i]).forEach((x) => {
      obj[x] = arr[i][x];
    });
  }

  return obj;
};

export const filter = (arr: any[], fields: string[], pattern: string) => {
  const contains = (s: any, p: string) => {
    return (s || '').toString().toLowerCase().indexOf(p.toLowerCase()) !== -1;
  };
  return arr.filter((row) => {
    return fields.find((field) => contains(row[field], pattern));
  });
};

export const getDisplayName = (Component: React.Component<*, *, *>) => {
  return Component.displayName || Component.name || 'Component';
};

export const blur = () => {
  // Give the document focus
  window.focus();

  // Remove focus from any focused element
  if (document.activeElement) {
    document.activeElement.blur();
  }
};

export const containsObjectWithField = (arr: any[], field: string, value: string): boolean => arr.filter((e) => e[field] === value).length > 0;

export const DATE_FORMAT_DISPLAY = 'DD.MM.YYYY';

export const parseUTCDate = (dateStr: string) => {
  return moment.utc(dateStr);
};

export const parseISODate = (dateStr: string) => {
  return moment(new Date(dateStr));
};
export const formatISOString = (d: Date)=> {
  return moment(d).format('YYYY-MM-DDT00:00:00.000Z');
};

export const parseFloatFromString = (value: string): number => {
  return typeof value === 'string' ? window.parseFloat(value.replace(',', '.')) : value;
};

export const formatFloatToString = (number: number): string => {
  return typeof number === 'number' ? number.toString().replace('.', ',') : number;
};

export const hasProp = (obj: any, prop: string): boolean => {
  return {}.hasOwnProperty.call(obj, prop);
};


export const customSortingStorageNodeType = (type: string): string => {
  switch (type) {
  case 'Organisation' : return '01';
  case 'Building': return '02';
  case 'Room': return '03';
  case 'StorageUnit': return '04';
  default: return '99';
  }
};

export const isDateBiggerThanToday = (newDate: any): boolean => {
  const today = moment();
  const isAfterYear = moment(newDate).isAfter(today, 'year');
  const isAfterMonth = moment(newDate).isAfter(today, 'month');
  const isAfterDay = moment(newDate).isAfter(today, 'day');
  return isAfterDay || isAfterMonth || isAfterYear;
};

export class Option {
  value = null;

  constructor(value: any) {
    this.value = value;
  }

  map<U>(func: (a: any) => U): ?U {
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

export const getPath = (node: any) => {
  const nodeIds = (node.path != null ? node.path : '').split(',').slice(1).map(p => parseFloat(p)).filter(n => n);
  const pathNames = node.pathNames || [{
    nodeId: node.id,
    name: node.name
  }];
  return nodeIds.map(nodeId => {
    let pathMatch = pathNames.find(e => e.nodeId === nodeId);
    if (!pathMatch) {
      pathMatch = {
        nodeId: node.id,
        name: node.name
      };
    }
    return {
      id: pathMatch.nodeId,
      name: pathMatch.name,
      url: '/magasin/' + pathMatch.nodeId
    };
  });
};