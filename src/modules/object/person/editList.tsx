import * as React from 'react';
import { AsyncCreatable } from 'react-select';

export type databaseOption = {
  value: string;
  label: string;
};

export type databaseOptions = databaseOption[];

const filterColors = (inputValue: string) =>
  dO.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()));

const dO: databaseOptions = [
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Twitter', label: 'Twitter' }
];

const promiseOptions = (inputValue: string) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(filterColors(inputValue));
    }, 1000);
  });

export const EditList = (props: { dO: databaseOptions }) => (
  <AsyncCreatable loadOptions={promiseOptions} />
);
