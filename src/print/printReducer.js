import Config from '../config';
import Template from './PrintTemplate';
import { QR_CODE } from './PrintTemplate';

export const CLEAR = 'musit/print/CLEAR';
export const CLEAR_RENDERED = 'musit/print/CLEAR_RENDERED';

export const SELECT_TEMPLATE = 'musit/print/SELECT_TEMPLATE';
export const SELECT_TYPE = 'musit/print/SELECT_TYPE';

export const LOAD_TEMPLATES = 'musit/print/LOAD_TEMPLATES';
export const LOAD_TEMPLATES_FAIL = 'musit/print/LOAD_TEMPLATES_FAIL';
export const LOAD_TEMPLATES_SUCCESS = 'musit/print/LOAD_TEMPLATES_SUCCESS';

export const LOAD_PREVIEW = 'musit/print/LOAD_PREVIEW';
export const LOAD_PREVIEW_FAIL = 'musit/print/LOAD_PREVIEW_FAIL';
export const LOAD_PREVIEW_SUCCESS = 'musit/print/LOAD_PREVIEW_SUCCESS';

const defaultState = {
  selectedType: 1
};

export default (state = defaultState, action) => {
  switch(action.type) {
  case CLEAR:
    return defaultState;
  case CLEAR_RENDERED:
    return {
      ...state,
      rendered: null
    };
  case SELECT_TEMPLATE:
    return {
      ...state,
      selected: action.template
    };
  case SELECT_TYPE:
    return {
      ...state,
      selectedType: action.codeType
    };
  case LOAD_TEMPLATES_SUCCESS:
    return {
      ...state,
      templates: action.result.map(props => new Template(props))
    };
  case LOAD_PREVIEW_SUCCESS:
    return {
      ...state,
      rendered: action.result
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

export const selectType = (codeType) => {
  return {
    type: SELECT_TYPE,
    codeType
  };
};

export const clear = () => {
  return {
    type: CLEAR
  };
};

export const clearRendered = () => {
  return {
    type: CLEAR_RENDERED
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

export const renderTemplate = (templateId, codeFormat, nodes) => {
  return {
    types: [LOAD_PREVIEW, LOAD_PREVIEW_SUCCESS, LOAD_PREVIEW_FAIL],
    promise: (client) => client.post(Config.magasin.urls.barcode.templateRenderUrl(templateId, codeFormat), {
      data: nodes.map(node => ({
        uuid: node.uuid,
        data: [
          {
            field: 'name',
            value: node.name
          }
        ]
      }))
    })
  };
};