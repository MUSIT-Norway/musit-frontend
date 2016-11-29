import Config from '../../config';
import Template from '../../models/PrintTemplate';

export const LOAD_TEMPLATES = 'musit/print/LOAD_TEMPLATES';
export const LOAD_TEMPLATES_FAIL = 'musit/print/LOAD_TEMPLATES_FAIL';
export const LOAD_TEMPLATES_SUCCESS = 'musit/print/LOAD_TEMPLATES_SUCCESS';

export default (state = {}, action) => {
  switch(action.type) {
  case LOAD_TEMPLATES_SUCCESS:
    return {
      ...state,
      templates: action.result.map(props => new Template(props))
    };
  default:
    return state;
  }
};

export const loadTemplates = () => {
  return {
    types: [LOAD_TEMPLATES, LOAD_TEMPLATES_SUCCESS, LOAD_TEMPLATES_FAIL],
    promise: (client) => client.get(Config.magasin.urls.barcode.templatesUrl)
  };
};