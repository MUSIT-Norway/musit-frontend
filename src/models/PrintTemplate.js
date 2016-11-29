class Template {
  id: number;
  name: string;
  labelWidth: number;
  labelHeight: number;
  colsPerPage: number;
  rowsPerPage: number;

  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.labelWidth = props.labelWidth;
    this.labelHeight = props.labelHeight;
    this.colsPerPage = props.colsPerPage;
    this.rowsPerPage = props.rowsPerPage;
  }
}

export default Template;