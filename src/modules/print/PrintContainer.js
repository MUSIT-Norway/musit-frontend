import { connect } from 'react-redux';
import PrintTemplateComponent from './PrintComponent';
import { loadTemplates, selectTemplate, selectType, clear, clearRendered, renderTemplate } from './printReducer';

const mapStateToProps = (state) => ({
  templates: state.print.templates,
  selectedType: state.print.selectedType,
  selectedTemplate: state.print.selected,
  rendered: state.print.rendered
});

const mapDispatchToProps = {
  clearDialog: clear,
  clearRendered,
  loadTemplates,
  selectTemplate,
  selectType,
  renderTemplate
};

export default connect(mapStateToProps, mapDispatchToProps)(PrintTemplateComponent);