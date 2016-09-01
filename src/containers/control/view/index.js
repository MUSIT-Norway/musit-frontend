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
import { hashHistory } from 'react-router'
import { Grid, Row, Col, ControlLabel, Button } from 'react-bootstrap'
import { ControlView } from '../../../components/control/view'
import DatePicker from 'react-bootstrap-date-picker'
import { MusitField } from '../../../components/formfields'
import Language from '../../../components/language'
import { connect } from 'react-redux'
import { loadControl } from '../../../reducers/control'
import { getActorNameFromId } from '../../../reducers/observation'

const mapStateToProps = (state) => ({
  translate: (key, markdown) => Language.translate(key, markdown),
  controls: state.control,
  doneBy: state.observation.data.doneBy
})

const mapDispatchToProps = (dispatch) => ({
  loadControl: (id, callback) => {
    dispatch(loadControl(id, callback))
  },
  loadPersonNameFromId: (id) => {
    dispatch(getActorNameFromId(id))
  }
})

@connect(mapStateToProps, mapDispatchToProps)
export default class ControlViewContainer extends React.Component {
  static propTypes = {
    translate: React.PropTypes.func.isRequired,
    controls: React.PropTypes.object,
    loadControl: React.PropTypes.func.isRequired,
    params: React.PropTypes.object,
    loadPersonNameFromId: React.PropTypes.func.isRequired,
    doneBy: React.PropTypes.object
  }

  componentWillMount() {
    if (this.props.params.controlId) {
      this.props.loadControl(this.props.params.controlId, {
        onSuccess: (r) => this.props.loadPersonNameFromId(r.doneBy)
      })
    }
  }
  render() {
    const { translate } = this.props

    const closeBtn = (
      <Row>
        <Col style={{ border: 'none', textAlign: 'center' }}>
          <Button onClick={() => { hashHistory.goBack() }}>
            Lukk
          </Button>
        </Col>
      </Row>
    )

    return (
      <div>
        <main>
          <Grid>
            <Row>
              <br />
              <br />
            </Row>
            <Row>
              <Col sm={4} smOffset={2}>
                <ControlLabel>{translate('musit.texts.datePerformed')}</ControlLabel>
                <br />
                <DatePicker
                  dateFormat="DD.MM.YYYY"
                  value={this.props.controls.data ? this.props.controls.data.doneDate : ''}
                />
              </Col>
              <Col sm={4} >
                <ControlLabel>{translate('musit.texts.performedBy')}</ControlLabel>
                <br />
                <MusitField
                  onChange={() => true}
                  id="performedBy"
                  value={this.props.doneBy ? this.props.doneBy.fn : ''}
                  validate="text"
                  disabled={Boolean(true)}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={4} smOffset={2}>
                <ControlLabel>{translate('musit.texts.dateRegistered')}</ControlLabel>
                <br />
                <DatePicker
                  dateFormat="DD.MM.YYYY"
                  value={this.props.controls.data ? this.props.controls.data.registeredDate : ''}
                />
              </Col>
              <Col sm={4} >
                <ControlLabel>{translate('musit.texts.registeredBy')}</ControlLabel>
                <br />
                <MusitField
                  onChange={() => true}
                  id="registeredBy"
                  value={this.props.controls.data ? this.props.controls.data.registeredBy : ''}
                  validate="text"
                  disabled={Boolean(true)}
                />
              </Col>
            </Row>
            <Row>
              <br />
            </Row>
            <Row>
              <Col sm={8} smOffset={2}>
                <ControlView
                  id="1"
                  translate={translate}
                  controlsJson={this.props.controls.data && this.props.controls.data['subEvents-parts'] ? this.props.controls.data['subEvents-parts'] : null}
                />
              </Col>
            </Row>
            {closeBtn}
          </Grid>
        </main>
      </div>
    )
  }
}
