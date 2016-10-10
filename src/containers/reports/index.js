import React from 'react'
import { connect } from 'react-redux';
import Language from '../../components/language'
import { Table, PageHeader } from 'react-bootstrap'
import { loadReports } from '../../reducers/reports'


const mapStateToProps = (state) => ({
  reports: state.reports.data,
  translate: (key, markdown) => Language.translate(key, markdown)
})

const mapDispatchToProps = (dispatch) => (
  {
    loadReports: () => dispatch(loadReports())
  })

class Reports extends React.Component {
  static propTypes = {
    reports: React.PropTypes.object,
    translate: React.PropTypes.func.isRequired,
    loadReports: React.PropTypes.func.isRequired
  }
  componentWillMount() {
    this.props.loadReports()
  }

  renderReports = (reports) => {
    if (reports) {
      return Object.keys(reports).map((k) => {
        const r = reports[k];
        return (<tr id={r.id}>
          <td>
            <a href={r.url}>
              {r.title}
            </a>
          </td>
          <td>
            {r.description}
          </td>
        </tr>) }
        )
    }
    return null
  }

  render() {
    const { reports } = this.props
    return (
      <div style={{ padding: '50px' }}>
        <PageHeader>
          Rapporter
        </PageHeader>
        <Table>
          <thead>
            <tr><th>Tittel</th> <th> Beskrivelse </th> </tr>
          </thead>
          <tbody>
            {this.renderReports(reports)}
          </tbody>
        </Table>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports)
