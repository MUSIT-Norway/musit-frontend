import React from 'react'
import { I18n } from 'react-i18nify'
import { Grid, Form, FormGroup, FormControl, ControlLabel, Button, Table } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

const ObjectSearchComponent = (props) =>
  <div style={{ paddingTop: 20 }}>
    <main>
      <Grid>
        <div>
          <h2>{I18n.t('musit.objectsearch.title')}</h2>
          <Form inline>
            <FormGroup controlId="formInlineName">
              <ControlLabel>Museumnr.</ControlLabel>
              {' '}
              <FormControl type="text" placeholder="" />
            </FormGroup>
            {' '}
            <FormGroup controlId="formInlineName">
              <ControlLabel>Unr.</ControlLabel>
              {' '}
              <FormControl type="text" placeholder="" />
            </FormGroup>
            {' '}
            <FormGroup controlId="formInlineName">
              <ControlLabel>Term/Artsnavn</ControlLabel>
              {' '}
              <FormControl type="text" placeholder="" />
            </FormGroup>
            {' '}
            <Button type="submit">
              Search
            </Button>
          </Form>
          {props.data.length > 0 &&
            <div>
              <br />
              <h4>Resultat - søket ga x treff:</h4>
              <Table>
                <thead>
                  <th>Museumnr.</th>
                  <th>Unr.</th>
                  <th>Term/Artsnavn</th>
                  <th>Plassering</th>
                  <th />
                </thead>
                <tbody>
                {props.data.map(data =>
                  <tr>
                    <td>{data.museumNo}</td>
                    <td>{data.subNo}</td>
                    <td>{data.term}</td>
                    <td>/ Museum / Bygg 1 / Rommet</td>
                    <td><FontAwesome name="truck" /></td>
                  </tr>
                )}
                </tbody>
              </Table>
              <span style={{ float: 'right' }}>1 2 3 Neste side</span>
            </div>
          }
        </div>
      </Grid>
    </main>
  </div>

export default ObjectSearchComponent