import { connect } from 'react-redux';
import PrintTemplateComponent from '../../components/print/ChooseTemplate';
import { renderTemplate } from '../../reducers/print/index';

const mapDispatchToProps = (dispatch) => {
  return {
    renderTemplate: (tid, cf, uuid, name) => dispatch(renderTemplate(tid, cf, uuid, name))
  };
};

const mapStateToProps = (state) => {
  return {
    selected: state.print.selected
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PrintTemplateComponent);