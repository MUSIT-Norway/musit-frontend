class Template {
  id: number;
  name: string;
  labelWidth: number;
  labelHeight: number;
  colsPerPage: number;
  rowsPerPage: number;
  content: string;

  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.labelWidth = props.labelWidth;
    this.labelHeight = props.labelHeight;
    this.colsPerPage = props.colsPerPage;
    this.rowsPerPage = props.rowsPerPage;
    this.content = props.content;
  }
}

export default Template;

export const QR_CODE = 1;