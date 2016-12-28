import { connect } from 'react-redux';
import { loadKDReport } from './reportsReducers';
import KDReport from './ReportsKDComponent';

const mapStateToProps = (state) => {
  return {
    data: state.reports && state.reports.data ? state.reports.data.kdreport.data : null,
    user: state.app.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  loadKDReport: (museumId) => dispatch(loadKDReport(museumId))
});

export default connect(mapStateToProps, mapDispatchToProps)(KDReport);
