
import React from 'react'
import { Table, PageHeader, Panel, Grid, Row } from 'react-bootstrap'
const I18n = require('react-i18nify').I18n

const reports = [
  {
    title: I18n.t('musit.reports.securingCollections.title'),
    url: '/#/reports/kdreport',
    description: I18n.t('musit.reports.securingCollections.description')
  }
]

export default () => {
  return (
    <div>
      <main>
        <Panel>
          <Grid>
            <Row className="row-centered">
              <PageHeader>
                Rapporter
              </PageHeader>
              <Table>
                <thead>
                  <tr>
                    <th>Tittel</th>
                    <th>Beskrivelse</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) =>
                    <tr key={index} id={report.id}>
                      <td>
                        <a href={report.url}>
                          {report.title}
                        </a>
                      </td>
                      <td>
                        {report.description}
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
