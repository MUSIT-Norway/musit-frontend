import React from 'react'
import { Table, PageHeader, Panel, Grid, Row } from 'react-bootstrap'
import { I18n } from 'react-i18nify'

const reports = [
  {
    title: 'musit.reports.securingCollections.title',
    url: '/#/reports/kdreport',
    description: 'musit.reports.securingCollections.description'
  }
];

export default () => {
  return (
    <div>
      <main>
        <Panel>
          <Grid>
            <Row className="row-centered">
              <PageHeader>
                {I18n.t('musit.reports.reports')}
              </PageHeader>
              <Table>
                <thead>
                  <tr>
                    <th>{I18n.t('musit.reports.titleHeader')}</th>
                    <th>{I18n.t('musit.reports.descriptionHeader')}</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) =>
                    <tr key={index} id={report.id}>
                      <td>
                        <a href={report.url}>
                          {I18n.t(report.title)}
                        </a>
                      </td>
                      <td>
                        {I18n.t(report.description)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Row>
          </Grid>
        </Panel>
      </main>
    </div>
  )
}
