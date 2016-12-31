import { connect } from 'react-redux';
import { loadKDReport } from './reportsReducers';
import KDReport from './ReportsKDComponent';

const mapStateToProps = (state) => ({
  data: state.reports && state.reports.data ? state.reports.data.kdreport.data : null,
  user: state.app.user
});

const mapDispatchToProps = {
  loadKDReport
};

export default connect(mapStateToProps, mapDispatchToProps)(KDReport);
