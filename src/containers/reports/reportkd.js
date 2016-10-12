
import React from 'react'
import { connect } from 'react-redux'
import { Table, PageHeader, Panel, Grid, Row } from 'react-bootstrap'
import { loadKDReport } from '../../reducers/reports'
import Language from '../../components/language'

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
                  {this.props.translate('musit.reports.securingCollections.header')}
                </PageHeader>
                <Table style={{ width: 700 }}>
                  <tbody>
                    <tr>
                      <td>{this.props.translate('musit.reports.securingCollections.totalArea')}</td>
                      <td>{data ? data.totalArea : null} m&sup2;</td>
                    </tr>
                    <tr>
                      <td>{this.props.translate('musit.reports.securingCollections.perimeter')}</td>
                      <td>{data ? data.perimeterSecurity : null} m&sup2;</td>
                    </tr>
                    <tr>
                      <td>{this.props.translate('musit.reports.securingCollections.theftProtection')}</td>
                      <td>{data ? data.theftProtection : null} m&sup2;</td>
                    </tr>
                    <tr>
                      <td>{this.props.translate('musit.reports.securingCollections.fireProtection')}</td>
                      <td>{data ? data.fireProtection : null} m&sup2;</td>
                    </tr>
                    <tr>
                      <td>{this.props.translate('musit.reports.securingCollections.waterDamage')}</td>
                      <td>{data ? data.waterDamageAssessment : null} m&sup2;</td>
                    </tr>
                    <tr>
                      <td>{this.props.translate('musit.reports.securingCollections.routinesAndContingencyPlan')}</td>
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
    data: state.reports && state.reports.data ? state.reports.data.kdreport.data : null,
    translate: (key, markdown) => Language.translate(key, markdown)
  }
}

const mapDispatchToProps = (dispatch) => ({
  loadKDReport: () => dispatch(loadKDReport())
})

export default connect(mapStateToProps, mapDispatchToProps)(KDReport)
