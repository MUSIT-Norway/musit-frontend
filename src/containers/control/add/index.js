
/*
 *  MUSIT is a museum database to archive natural and cultural history data.
 *  Copyright (C) 2016  MUSIT Norway, part of www.uio.no (University of Oslo)
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License,
 *  or any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import React from 'react'
import { Grid, Row, Col, FormControl } from 'react-bootstrap'
import PairedToogleButtons from '../../../components/control/add'
import DatePicker from 'react-bootstrap-date-picker'
import moment from 'moment'
import SaveCancel from '../../../components/formfields/saveCancel/SaveCancel'
import { hashHistory } from 'react-router'
import { flatten, parseISODateNonStrict as parseISODate, DATE_FORMAT_DISPLAY, hasProp } from '../../../util'
import ActorSuggest from '../../../components/actor'
import Layout from '../../../layout'
import Breadcrumb from '../../../layout/Breadcrumb'

export default class ControlAddContainer extends React.Component {
  static propTypes = {
    translate: React.PropTypes.func.isRequired,
    saveControl: React.PropTypes.func.isRequired,
    params: React.PropTypes.object,
    actor: React.PropTypes.object,
    envReqData: React.PropTypes.object,
    path: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  constructor(props) {
    super(props)
    this.state = {
      temperature: this.props.envReqData ? this.props.envReqData.temperature : ' ',
      temperatureTolerance: this.props.envReqData ? this.props.envReqData.temperatureTolerance : ' ',
      relativeHumidity: this.props.envReqData ? this.props.envReqData.relativeHumidity : ' ',
      relativeHumidityInterval: this.props.envReqData ? this.props.envReqData.relativeHumidityTolerance : ' ',
      inertAir: this.props.envReqData ? this.props.envReqData.hypoxicAir : ' ',
      inertAirInterval: this.props.envReqData ? this.props.envReqData.hypoxicAirTolerance : ' ',
      light: this.props.envReqData ? this.props.envReqData.lightingCondition : ' ',
      cleaning: this.props.envReqData ? this.props.envReqData.cleaning : ' ',
      doneDate: moment(),
      doneBy: this.props.actor
    }
    this.onControlClick = this.onControlClick.bind(this)
    this.onControlClickOK = this.onControlClickOK.bind(this)
    this.onControlClickNOK = this.onControlClickNOK.bind(this)
    this.onClickSave = this.onClickSave.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.actor && this.props.actor && nextProps.actor.id !== this.props.actor.id) {
      this.setState({ ...this.state, doneBy: nextProps.actor })
    }
  }

  onControlClick(key, bool) {
    const me = this
    return () => {
      if (me.state[key] != null && me.state[key] === bool) {
        me.setState({ ...me.state, [key]: null })
      } else {
        me.setState({ ...me.state, [key]: bool })
      }
    }
  }

  onControlClickOK(key) {
    return this.onControlClick(key, true)
  }

  onControlClickNOK(key) {
    return this.onControlClick(key, false)
  }

  oneStateIsNotOK() {
    return Object.keys(this.state).filter((k) => k.endsWith('OK') && this.state[k] === false).length > 0
  }

  onClickSave() {
    // Could extract it, but its only used here and in the method aboveonFailure
    const controls = Object.keys(this.state)
        .filter((k) => k.endsWith('OK') && this.state[k] !== null && typeof this.state[k] !== 'undefined')
        .map((k) => ({
          [k]: this.state[k]
        }))
    // Create a nice representation of the control state
    const controlState = {
      ...flatten(controls),
      doneBy: this.state.doneBy,
      doneDate: this.state.doneDate
    }
    if (this.oneStateIsNotOK()) {
      // push a new path onto the history, with the provided nice control state
      hashHistory.replace({
        pathname: `/magasin/${this.props.params.id}/observation/edit`,
        state: controlState
      })
    } else {
      this.props.saveControl(this.props.params.id, controlState, {
        onSuccess: () => hashHistory.goBack(),
        onFailure: () => window.alert('Kunne ikke lagre kontroll')
      }, this.props.params.id)
    }
  }

  setDate = (newValue) => {
    if (newValue) {
      if (moment().format('DD/MM/YYYY') < moment(newValue).format('DD/MM/YYYY')) {
        window.alert(this.props.translate('musit.newControl.dateValidation'))
        this.setState({ ...this.state, doneDate: moment() })
      } else {
        this.setState({ ...this.state, doneDate: parseISODate(newValue) })
      }
    }
  }
  handleSubmit(event) {
    event.preventDefault()
    const errors = []
    const controls = Object.keys(this.state).filter((k) => k.endsWith('OK') && this.state[k] !== null)
    if (controls.length === 0) {
      errors.push(this.props.translate('musit.newControl.controlsRequired'))
    }
    if (!this.state.doneBy || !this.state.doneBy.id) {
      errors.push(this.props.translate('musit.newControl.doneByRequired'))
    }
    if (!this.state.doneDate) {
      errors.push(this.props.translate('musit.newControl.dateRequired'))
    }
    if (errors.length === 0) {
      this.onClickSave()
    } else {
      this.setState({ ...this.state, errors })
    }
  }

  render() {
    const nodes = this.props.path
    const breadcrumb = <Breadcrumb nodes={nodes} passive />
    const { translate } = this.props

    const fields = [
      {
        key: 'temperature',
        leftValue: this.state.temperature,
        rightValue: this.state.temperatureTolerance
      },
      {
        key: 'relativeHumidity',
        leftValue: this.state.relativeHumidity,
        rightValue: this.state.relativeHumidityInterval
      },
      {
        key: 'hypoxicAir',
        leftValue: this.state.inertAir,
        rightValue: this.state.inertAirInterval
      },
      {
        key: 'lightCondition',
        leftValue: this.state.light
      },
      {
        key: 'cleaning',
        leftValue: this.state.cleaning
      },
      { key: 'gas' },
      { key: 'alcohol' },
      { key: 'mold' },
      { key: 'pest' }
    ]

    const renderReadOnly = (e) => {
      const make = (v) => <FormControl style={{ backgroundColor: '#f2f2f2' }} readOnly value={v} />

      if (hasProp(e, 'leftValue') && hasProp(e, 'rightValue')) {
        return (<div>
          <Col xs={5}>
            {make(e.leftValue)}
          </Col>
          <Col xs={4}>
            {make(e.rightValue)}
          </Col>
        </div>)
      }

      if (hasProp(e, 'leftValue')) {
        return <Col md={9}>{make(e.leftValue)}</Col>
      }

      return (<Col md={9}>{null}</Col>)
    }

    return (
      <Layout
        title="Magasin"
        translate={this.props.translate}
        breadcrumb={breadcrumb}
        content={
          <form onSubmit={this.handleSubmit}>
            <h4 style={{ textAlign: 'center' }}>{this.props.translate('musit.newControl.title', false)}</h4>
            <Grid>
              <Row>
                <Col xs={3}>
                  <Col xs={2} />
                  <Col xs={10}>
                    <Row>
                      <Col xs={12}>
                        <label>
                          {translate('musit.newControl.date')}
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        <DatePicker
                          dateFormat={DATE_FORMAT_DISPLAY}
                          value={this.state.doneDate.toISOString()}
                          onClear={() => this.setState({ ...this.state, doneDate: moment() })}
                          onChange={newValue => {
                            this.setDate(newValue)
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Col>
                <Col xs={9}>
                  <Row>
                    <Col xs={5}>
                      <label>
                        {translate('musit.newControl.doneBy')}
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={9}>
                      <ActorSuggest
                        id="doneByField"
                        value={this.state.doneBy ? this.state.doneBy.fn : ''}
                        placeHolder="Find actor"
                        onChange={newValue => {
                          this.setState({ ...this.state, doneBy: newValue })
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>

              {fields.map((e, i) => {
                return (
                  <Row key={i}>
                    <hr />
                    <Col xs={3}>
                      <PairedToogleButtons
                        label={translate(`musit.newControl.${e.key}`)}
                        value={this.state[`${e.key}OK`]}
                        updatevalueOK={this.onControlClickOK(`${e.key}OK`)}
                        updatevalueNotOK={this.onControlClickNOK(`${e.key}OK`)}
                      />
                    </Col>
                    <Col xs={9}>
                      <Row>
                        <Col xs={5}>
                          {hasProp(e, 'leftValue') ?
                            <label> {translate('musit.newControl.envdata')} </label> : ''
                          }
                        </Col>
                      </Row>
                      <Row>
                        {renderReadOnly(e)}
                      </Row>
                    </Col>
                  </Row>
                )
              })}
              <hr />
              {this.state.errors && this.state.errors.map((e, i) => {
                return <center><span key={i} style={{ color: 'red' }}>{e}</span></center>
              })}
              <hr />
              <SaveCancel
                saveLabel={translate(this.oneStateIsNotOK() ? 'musit.newControl.registerObservations' : 'musit.texts.save')}
                translate={translate}
                onClickSave={(e) => this.handleSubmit(e)}
                onClickCancel={() => { hashHistory.goBack() }}
              />
            </Grid>
          </form>
        }
      />
    )
  }
}
