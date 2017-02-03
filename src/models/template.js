import entries from 'object.entries';

class Template {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

export default Template;