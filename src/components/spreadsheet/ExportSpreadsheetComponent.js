// @flow

import React from 'react';
import FileSaver from 'file-saver';
import { jsonToWorksheetBinary } from './spreadsheet';
import { stringToArrayBuffer } from './arrayBufferHelper';

type Props = {
  content: Array<any>,
  name: string
};

const downloadExcelSheet = (jsonContent: Array<any>, name: string) => {
  const output = jsonToWorksheetBinary(jsonContent);
  const blob = new Blob([stringToArrayBuffer(output)], {
    type: 'application/octet-stream'
  });
  const fileName = name + '.xlsx';
  FileSaver.saveAs(blob, fileName);
};

const ExportSpreadsheetComponent = (props: Props) => (
  <div>
    {props.content &&
      <button onClick={() => downloadExcelSheet(props.content, props.name)}>
        {props.name}
      </button>}
  </div>
);

export default ExportSpreadsheetComponent;
