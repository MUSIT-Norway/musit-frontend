import React from 'react'
import { connect } from 'react-redux'
import { Table, PageHeader, Panel, Grid, Row } from 'react-bootstrap'
import { loadKDReport } from '../../reducers/reports'
// const I18n = require('react-i18nify').I18n;

export class KDReport extends React.Component {
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
      <div>
        <main>
          <Panel>
            <Grid>
              <Row className="row-centered">
                <PageHeader>
                    Rapport - Sikring av samlinger
                </PageHeader>
                <Table style={{ width: 700 }}>
                  <tbody>
                    <tr>
                      <td>Totalt areal:</td>
                      <td>{data ? data.totalArea : null} m&sup2;</td>
                    </tr>
                    <tr>
                      <td>Skallsikring:</td>
                      <td>{data ? data.perimeterSecurity : null} m&sup2;</td>
                    </tr>
                    <tr>
                      <td>Tyverisikring:</td>
                      <td>{data ? data.theftProtection : null} m&sup2;</td>
                    </tr>
                    <tr>
                      <td>Brannsikring:</td>
                      <td>{data ? data.fireProtection : null} m&sup2;</td>
                    </tr>
                    <tr>
                      <td>Vannskaderisiko:</td>
                      <td>{data ? data.waterDamageAssessment : null} m&sup2;</td>
                    </tr>
                    <tr>
                      <td>Rutiner og beredskap:</td>
                      <td>{data ? data.routinesAndContingencyPlan : null} m&sup2;</td>
                    </tr>
                  </tbody>
                </Table>
              </Row>
            </Grid>
          </Panel>
        </main>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    data: state.reports && state.reports.data ? state.reports.data.kdreport.data : null
  }
}

const mapDispatchToProps = (dispatch) => ({
  loadKDReport: () => dispatch(loadKDReport())
})

export default connect(mapStateToProps, mapDispatchToProps)(KDReport)
