// @flow

import * as React from 'react';
import * as FileSaver from 'file-saver';
import { jsonToWorksheetBinary } from './spreadsheet';
import { stringToArrayBuffer } from './arrayBufferHelper';

type Props = {
  content: Array<any>,
  displayName: string,
  fileName: string,
  styles?: Array<string>
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
    {props.content && (
      <button
        className={(props.styles || []).join(' ')}
        onClick={() => downloadExcelSheet(props.content, props.fileName)}
      >
        {props.displayName}
      </button>
    )}
  </div>
);

export default ExportSpreadsheetComponent;
