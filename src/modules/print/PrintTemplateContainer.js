import { connect } from 'react-redux';
import PrintTemplateComponent from './PrintTemplateComponent';
import { loadTemplates, selectTemplate, selectType, clear, clearRendered, renderTemplate } from '../../reducers/print/index';

const mapDispatchToProps = (dispatch) => {
  return {
    clearDialog: () => dispatch(clear()),
    clearRendered: () => dispatch(clearRendered()),
    loadTemplates: () => dispatch(loadTemplates()),
    selectTemplate: (template) => dispatch(selectTemplate(template)),
    selectType: (type) => dispatch(selectType(type)),
    renderTemplate: (tid, cf, uuid, name) => dispatch(renderTemplate(tid, cf, uuid, name))
  };
};

const mapStateToProps = (state) => {
  return {
    templates: state.print.templates,
    selectedType: state.print.selectedType,
    selectedTemplate: state.print.selected,
    rendered: state.print.rendered
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PrintTemplateComponent);