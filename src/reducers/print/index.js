import Config from '../../config';
import Template from '../../models/PrintTemplate';
import { QR_CODE } from '../../models/PrintTemplate';

export const SELECT_TEMPLATE = 'musit/print/SELECT_TEMPLATE';

export const LOAD_TEMPLATES = 'musit/print/LOAD_TEMPLATES';
export const LOAD_TEMPLATES_FAIL = 'musit/print/LOAD_TEMPLATES_FAIL';
export const LOAD_TEMPLATES_SUCCESS = 'musit/print/LOAD_TEMPLATES_SUCCESS';

export default (state = {}, action) => {
  switch(action.type) {
  case SELECT_TEMPLATE:
    return {
      ...state,
      selected: action.template
    };
  case LOAD_TEMPLATES_SUCCESS:
    return {
      ...state,
      templates: action.result.map(props => new Template(props))
    };
  default:
    return state;
  }
};

export const selectTemplate = (template) => {
  return {
    type: SELECT_TEMPLATE,
    template
  };
};

export const loadTemplates = () => {
  return {
    types: [LOAD_TEMPLATES, LOAD_TEMPLATES_SUCCESS, LOAD_TEMPLATES_FAIL],
    promise: (client) =>
      new Promise((resolve) =>
        client.get(Config.magasin.urls.barcode.templatesUrl)
          .then(templates =>
            Promise.all(
              templates.map(template =>
                new Promise((res) =>
                  client.get(Config.magasin.urls.barcode.templatePreviewUrl(
                    template.id,
                    QR_CODE,
                    'Lorem ipsum dolor sit amet',
                    '3f0b7f22-1c6f-4f74-9b72-8a7672e91534'
                  )).then(r => res({...template, content: r}))
                )
              )
            ).then(result => resolve(result))
          )
      )
  };
};