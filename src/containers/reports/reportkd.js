import React from 'react'
import { connect } from 'react-redux'
import { Table, PageHeader } from 'react-bootstrap'
import { loadKDReport } from '../../reducers/reports'

const mapStateToProps = (state) => {
  return {
    data: state.reports.kdreport
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
              <td> Areal:</td><td>{data.totalArea}</td>
            </tr>
            <tr>
              <td> Skallsikring: </td><td>{data.perimeterSecurity}</td>
            </tr>
            <tr>
              <td> Tyverisikring: </td><td>{data.theftProtection}</td>
            </tr>
            <tr>
              <td> Brannsikring: </td><td>{data.fireProtection}</td>
            </tr>
            <tr>
              <td> Vannsikring: </td><td>{data.waterDamageAssessment}</td>
            </tr>
            <tr>
              <td> Rutiner og beredskap: </td><td>{data.routinesAndContingencyPlan}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }

}
