import { connect } from 'react-redux';
import { loadKDReport } from './reportsReducer';
import KDReport from './KDReportComponent';
import MuseumId from '../../shared/models/museumId';

const mapStateToProps = (state) => {
  return {
    data: state.reports && state.reports.data ? state.reports.data.kdreport.data : null,
    user: (state.auth && state.auth.user) || { museumId: new MuseumId(99) }
  };
};

const mapDispatchToProps = (dispatch) => ({
  loadKDReport: (museumId) => dispatch(loadKDReport(museumId))
});

export default connect(mapStateToProps, mapDispatchToProps)(KDReport);
