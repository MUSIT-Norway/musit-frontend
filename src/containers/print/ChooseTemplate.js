import { connect } from 'react-redux';
import ChooseTemplateComponent from '../../components/print/ChooseTemplate';
import { loadTemplates, selectTemplate } from '../../reducers/print/index';

const mapDispatchToProps = (dispatch) => {
  return {
    loadTemplates: () => dispatch(loadTemplates()),
    selectTemplate: (template) => dispatch(selectTemplate(template))
  };
};

const mapStateToProps = (state) => {
  return {
    templates: state.print.templates
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseTemplateComponent);