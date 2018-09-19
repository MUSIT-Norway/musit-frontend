import * as React from 'react';
import { AsyncCreatable } from 'react-select';

export type databaseOption = {
  value: string;
  label: string;
  url: string;
};

export type databaseOptions = databaseOption[];

const getOptions = (data: databaseOptions) => (input: string, callback: Function) => {
  setTimeout(() => {
    callback(null, {
      options: data,
      // CAREFUL! Only set this to true when there are no more options,
      // or more specific queries will not be sent to the server.
      complete: false
    });
  }, 500);
};

export type editListProps = {
  dataBaseValues: databaseOptions;
  editingValue: string;
  onChangeSelection: (inputValue: databaseOption) => void;
};

export const EditList = (props: editListProps) => (
  <div>
    <AsyncCreatable
      name="editListDatabase"
      loadOptions={getOptions(props.dataBaseValues)}
      value={props.editingValue}
      onChange={props.onChangeSelection}
      clearable={false}
    />
  </div>
);
