import { connect } from 'react-redux';
import PrintTemplateComponent from '../../components/print/PrintTemplate';
import { loadTemplates, selectTemplate, clear, clearRendered, renderTemplate } from '../../reducers/print/index';

const mapDispatchToProps = (dispatch) => {
  return {
    clearDialog: () => dispatch(clear()),
    clearRendered: () => dispatch(clearRendered()),
    loadTemplates: () => dispatch(loadTemplates()),
    selectTemplate: (template) => dispatch(selectTemplate(template)),
    renderTemplate: (tid, cf, uuid, name) => dispatch(renderTemplate(tid, cf, uuid, name))
  };
};

const mapStateToProps = (state) => {
  return {
    templates: state.print.templates,
    selected: state.print.selected,
    rendered: state.print.rendered
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PrintTemplateComponent);