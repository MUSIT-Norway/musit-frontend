// @flow

import xlsx from 'xlsx';

export function jsonToWorksheetBinary(jsonContent: Array<any>): string {
  const sheet = xlsx.utils.json_to_sheet(jsonContent);
  const wb = { SheetNames: ['Sheet1'], Sheets: { Sheet1: sheet } };
  return xlsx.write(wb, { type: 'binary', bookSST: true, bookType: 'xlsx' });
}

export function binaryWorksheetToJson(data: string, header?: Array<string>): Array<any> {
  const workbook = xlsx.read(data, { type: 'binary' });
  const sheetOneName = workbook.Sheets[workbook.SheetNames[0]];
  const sheetOne = xlsx.utils.sheet_to_json(sheetOneName, { header });
  return header ? sheetOne.splice(1) : sheetOne;
}
