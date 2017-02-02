import React from 'react';
import { Table, PageHeader, Panel, Grid, Row } from 'react-bootstrap';
import { I18n } from 'react-i18nify';
import { formatFloatToString } from './../../shared/util';
import { Observable } from 'rxjs';
import reportStore$, { loadKDReport$, clear$ } from './reportStore';
import inject from 'react-rxjs/dist/RxInject';

export class KDReport extends React.Component {
  static propTypes= {
    data: React.PropTypes.object,
    loadKDReport: React.PropTypes.func
  };

  componentWillMount() {
    const museumId = this.props.appSession.getMuseumId();
    const token = this.props.appSession.getAccessToken();
    this.props.loadKDReport({museumId, token});
  }

  render() {
    const data = this.props.store.data.kdreport;

    return (
      <div>
        <main>
          <Panel>
            <Grid>
              <Row className="row-centered">
                <PageHeader>
                  {I18n.t('musit.reports.securingCollections.header')}
                </PageHeader>
                <Table style={{ width: 700 }}>
                  <tbody>
                  <tr>
                    <td>{I18n.t('musit.reports.securingCollections.totalArea')}</td>
                    <td>{data ? formatFloatToString(data.totalArea) : null} m&sup2;</td>
                  </tr>
                  <tr>
                    <td>{I18n.t('musit.reports.securingCollections.perimeter')}</td>
                    <td>{data ? formatFloatToString(data.perimeterSecurity) : null} m&sup2;</td>
                  </tr>
                  <tr>
                    <td>{I18n.t('musit.reports.securingCollections.theftProtection')}</td>
                    <td>{data ? formatFloatToString(data.theftProtection) : null} m&sup2;</td>
                  </tr>
                  <tr>
                    <td>{I18n.t('musit.reports.securingCollections.fireProtection')}</td>
                    <td>{data ? formatFloatToString(data.fireProtection) : null} m&sup2;</td>
                  </tr>
                  <tr>
                    <td>{I18n.t('musit.reports.securingCollections.waterDamage')}</td>
                    <td>{data ? formatFloatToString(data.waterDamageAssessment) : null} m&sup2;</td>
                  </tr>
                  <tr>
                    <td>{I18n.t('musit.reports.securingCollections.routinesAndContingencyPlan')}</td>
                    <td>{data ? formatFloatToString(data.routinesAndContingencyPlan) : null} m&sup2;</td>
                  </tr>
                  </tbody>
                </Table>
              </Row>
            </Grid>
          </Panel>
        </main>
      </div>
    );
  }

}

const data = {
  appSession$: { type: React.PropTypes.instanceOf(Observable).isRequired },
  store$: reportStore$
};

const commands = {
  loadKDReport$,
  clear$
};

export default inject(data,commands)(KDReport);
