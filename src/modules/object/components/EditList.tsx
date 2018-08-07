import * as React from 'react';
import * as AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';


export type databaseOption= {
    inputValue: string;
    label: string;
};

export type databaseOptions= databaseOption[];

const filterColors = (inputValue: string) =>
  dO.filter(i =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const dO:databaseOptions = [
    { inputValue: 'Facebook', label: 'Facebook'},
    { inputValue: 'Twitter', label: 'Twitter'}
  ];

const promiseOptions = (inputValue:string) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(filterColors(inputValue));
    }, 1000);
  });

export const EditList = (props: {
    dO:databaseOptions;
}) =>
 (
      <AsyncCreatableSelect
        cacheOptions
        defaultOptions
        promiseOptions={promiseOptions}
    />

);

