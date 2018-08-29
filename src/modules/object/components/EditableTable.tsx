import ReactTable from 'react-table';
import * as React from 'react';
import { data } from '../person/mockdata/data';

const column = [
  {
    Header: 'Name',
    accessor: 'name', // String-based value accessors!
    maxWidth: 400
  },
  {
    Header: 'Age',
    accessor: 'age',
    maxWidth: 100
  }
];

const EditableTable = () => {
  console.log('Anuradha classes');
  return (
    <div
      style={{ backgroundColor: '#fafafa' }}
      contentEditable
      suppressContentEditableWarning
    >
      <ReactTable
        data={data}
        columns={column}
        defaultPageSize={10}
        loading={true}
        className="-striped -highlight"
      />
    </div>
  );
};

export default EditableTable;
