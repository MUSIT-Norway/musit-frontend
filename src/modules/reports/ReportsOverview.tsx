import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Table, PageHeader, Panel, Grid, Row } from 'react-bootstrap';
import { I18n } from 'react-i18nify';
import Config from '../../config';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import { TODO } from '../../types/common';

const reports = [
  {
    title: 'musit.reports.securingCollections.title',
    url: Config.magasin.urls.client.report.goToKdReport,
    description: 'musit.reports.securingCollections.description'
  }
];

export const ReportsOverview = (props: TODO) => {
  return (
    <div>
      <main>
        <Panel>
          <Grid>
            <Row className="row-centered">
              <PageHeader>{I18n.t('musit.reports.reports')}</PageHeader>
              <Table>
                <thead>
                  <tr>
                    <th>{I18n.t('musit.reports.titleHeader')}</th>
                    <th>{I18n.t('musit.reports.descriptionHeader')}</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => {
                    const url = report.url(props.appSession);
                    return (
                      <tr key={index}>
                        <td>
                          <a
                            href={url}
                            onClick={e => {
                              e.preventDefault();
                              props.history.push(url);
                            }}
                          >
                            {I18n.t(report.title)}
                          </a>
                        </td>
                        <td>{I18n.t(report.description)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Row>
          </Grid>
        </Panel>
      </main>
    </div>
  );
};

const data = {
  appSession$: { type: PropTypes.object.isRequired }
};

export default inject(data)(ReportsOverview);
