
import React from 'react'
import { Table, PageHeader, Panel, Grid, Row } from 'react-bootstrap'

const reports = [
  {
    title: 'Sikring av samlinger',
    url: '/#/reports/kdreport',
    description: 'Sikringsindikatorer som rapporteres til KD.',
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
