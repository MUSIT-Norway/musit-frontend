// @flow

import * as React from 'react';
import { binaryWorksheetToJson } from './spreadsheet';
import { arrayBufferToBinaryString } from './arrayBufferHelper';
import { eventTargetResult, TODO } from '../../types/common';

declare var FileReader: any;
type Props = {
  loadContent: (content: Array<any>) => void;
  header?: Array<string>;
};

/**
 * IE doesn't have the `FileRead.readAsBinaryString` function so we have to do
 * some extra job to get the right types.. Thank you IE!!
 */
const handleFile = (loadContent: TODO, header: TODO) => (e: TODO) => {
  const files = e.target.files;
  if (files.length === 1) {
    const reader: FileReader = new FileReader();
    const hasBinaryString = typeof reader.readAsBinaryString === 'function';
    reader.onload = evt => {
      const data = hasBinaryString
        ? eventTargetResult(evt)
        : arrayBufferToBinaryString(eventTargetResult(evt));
      loadContent(binaryWorksheetToJson(data, header));
    };

    if (hasBinaryString) {
      reader.readAsBinaryString(files[0]);
    } else {
      reader.readAsArrayBuffer(files[0]);
    }
  }
};

const ImportSpreadsheetComponent = (props: Props) => (
  <div>
    <input type="file" onChange={handleFile(props.loadContent, props.header)} />
  </div>
);

export default ImportSpreadsheetComponent;
