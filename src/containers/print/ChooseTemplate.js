import { connect } from 'react-redux';
import ChooseTemplateComponent from '../../components/print/ChooseTemplate';
import { loadTemplates } from '../../reducers/print/index';

const mapDispatchToProps = (dispatch) => {
  return {
    loadTemplates: () => dispatch(loadTemplates())
  };
};

const mapStateToProps = (state) => {
  return {
    templates: state.print.templates
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseTemplateComponent);