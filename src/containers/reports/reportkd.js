import React from 'react'
import { connect } from 'react-redux'
import { Table, PageHeader } from 'react-bootstrap'
import { loadKDReport } from '../../reducers/reports'

const mapStateToProps = (state) => {
  return {
    data: state.reports && state.reports.data ? state.reports.data.kdreport.data : null
  }
}

const mapDispatchToProps = (dispatch) => (
  {
    loadKDReport: () => dispatch(loadKDReport())
  })

@connect(mapStateToProps, mapDispatchToProps)

export default class KDReport extends React.Component {
  static propTypes= {
    data: React.PropTypes.object,
    loadKDReport: React.PropTypes.func
  }
  componentWillMount() {
    this.props.loadKDReport()
  }

  render() {
    const { data } = this.props
    return (
      <div style={{ padding: '50px' }}>
        <PageHeader>
          Rapport - Sikringstilstand
        </PageHeader>
        <Table>
          <tbody>
            <tr>
              <td> Areal:</td><td>{data ? data.totalArea : null}</td>
            </tr>
            <tr>
              <td> Skallsikring: </td><td>{data ? data.perimeterSecurity : null}</td>
            </tr>
            <tr>
              <td> Tyverisikring: </td><td>{data ? data.theftProtection : null}</td>
            </tr>
            <tr>
              <td> Brannsikring: </td><td>{data ? data.fireProtection : null}</td>
            </tr>
            <tr>
              <td> Vannsikring: </td><td>{data ? data.waterDamageAssessment : null}</td>
            </tr>
            <tr>
              <td> Rutiner og beredskap: </td><td>{data ? data.routinesAndContingencyPlan : null}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }

}
