import React, { PropTypes } from 'react'
import { PageHeader, Panel, Grid, Row, Col, Button, FormGroup, FormControl, ControlLabel, SplitButton, MenuItem } from 'react-bootstrap'
import {
    ObservationFromToNumberCommentComponent
} from '../../../components/observation'
import { containsObjectWithField } from '../../../util'

export default class ObservationPage extends React.Component {

  types = [ '', 'temperature', 'gas', 'flux', 'pest', 'mold' ]

  constructor(props) {
    super(props)
    this.state = {
      selectedType: null,
      observations: []
    }
    this.isTypeAdded = this.isTypeAdded.bind(this)
    this.isTypeSelectable = this.isTypeSelectable.bind(this)
  }

  renderObservationType(type, props) {
    switch (type) {
      case 'temperature':
        return this.renderTemperatureObservation(props)
    }
  }

  renderTemperatureObservation(props) {
    return (
      <div>
        <h3>Temperatur</h3>
        <ObservationFromToNumberCommentComponent {...props} />
      </div>
    )
  }

  getTemperatureProperties() {
    return {
      translate: (k) => k
    }
  }

  addObservationType(type) {
    const observations = [...this.state.observations]
    switch (type) {
      case 'temperature':
        observations.push({ type, props: this.getTemperatureProperties() });
        break
      default:
        console.log('Unknown type')
    }
    this.setState({ ...this.state, observations, selectedType: null })
  }

  isTypeAdded(typeStr) {
    return containsObjectWithField(this.state.observations, 'type', typeStr)
  }

  isTypeSelectable(type) {
    return !this.isTypeAdded(type)
  }

  render() {
    return (
      <div>
        <main>
          <Panel>
            <Grid>
              <Row>
                <Col style={{ textAlign: 'center' }}>
                  <PageHeader>
                    Add new observation
                  </PageHeader>
                </Col>
              </Row>
              <Row>
                <form>
                  <Row>
                    <Col xs={4}>
                      <FormGroup controlId="formControlsSelect">
                        <FormControl
                          componentClass="select"
                          placeholder="select"
                          onChange={(e) => {
                            const selectedType = e.target.options[e.target.selectedIndex].value
                            this.setState({
                              ...this.state,
                              selectedType
                            })
                          }}
                        >
                          {this.types.filter(this.isTypeSelectable).map((typeValue) => {
                            return (
                              <option value={typeValue} selected={this.state.selectedType === typeValue ? 'selected' : ''}>{typeValue === '' ? 'Velg type' : typeValue}</option>
                            )
                          })}
                        </FormControl>
                      </FormGroup>
                    </Col>
                    <Col xs={4}>
                      <Button
                        bsStyle="primary"
                        onClick={() => this.addObservationType(this.state.selectedType)}
                      >
                          Legg til
                      </Button>
                    </Col>
                  </Row>
                  {this.state.observations.map((obs) => this.renderObservationType(obs.type, obs.props))}
                </form>
              </Row>
            </Grid>
          </Panel>
        </main>
      </div>
    )
  }
}
