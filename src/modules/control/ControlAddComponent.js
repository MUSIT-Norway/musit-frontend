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
import React from 'react';
import { Grid, Row, Col, FormControl } from 'react-bootstrap';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';

import PairedToogleButtons from './ControlAddButtons';

import SaveCancel from '../../components/formfields/saveCancel/SaveCancel';
import ActorSuggest from '../../components/ActorSuggest';

import { isDateBiggerThanToday, flatten, DATE_FORMAT_DISPLAY, hasProp } from '../../util';
import { emitError, emitSuccess } from '../../util/errors/emitter';
import DatePicker from '../../util/datePicker';

import Layout from '../../layout';
import Breadcrumb from '../../layout/Breadcrumb';

export default class ControlAddContainer extends React.Component {
  static propTypes = {
    saveControl: React.PropTypes.func.isRequired,
    params: React.PropTypes.object,
    actor: React.PropTypes.object,
    envReqData: React.PropTypes.object,
    rootNode: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      temperature: this.props.envReqData ? this.props.envReqData.temperature : ' ',
      temperatureTolerance: this.props.envReqData ? this.props.envReqData.temperatureTolerance : ' ',
      relativeHumidity: this.props.envReqData ? this.props.envReqData.relativeHumidity : ' ',
      relativeHumidityInterval: this.props.envReqData ? this.props.envReqData.relativeHumidityTolerance : ' ',
      inertAir: this.props.envReqData ? this.props.envReqData.hypoxicAir : ' ',
      inertAirInterval: this.props.envReqData ? this.props.envReqData.hypoxicAirTolerance : ' ',
      light: this.props.envReqData ? this.props.envReqData.lightingCondition : ' ',
      cleaning: this.props.envReqData ? this.props.envReqData.cleaning : ' ',
      doneDate: this.props.doneDate ? this.props.doneDate : new Date().toISOString(),
      doneBy: this.props.actor
    };
    this.onControlClick = this.onControlClick.bind(this);
    this.onControlClickOK = this.onControlClickOK.bind(this);
    this.onControlClickNOK = this.onControlClickNOK.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    if (!this.props.rootNode.path) {
      this.props.loadStorageObj(this.props.params.id, this.props.user.museumId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.actor !== this.props.actor) {
      this.setState({ ...this.state, doneBy: nextProps.actor });
    }
  }

  onControlClick(key, bool) {
    const me = this;
    return () => {
      if (me.state[key] != null && me.state[key] === bool) {
        me.setState({ ...me.state, [key]: null });
      } else {
        me.setState({ ...me.state, [key]: bool });
      }
    };
  }

  onControlClickOK(key) {
    return this.onControlClick(key, true);
  }

  onControlClickNOK(key) {
    return this.onControlClick(key, false);
  }

  oneStateIsNotOK() {
    return Object.keys(this.state).filter((k) => k.endsWith('OK') && this.state[k] === false).length > 0;
  }

  onClickSave() {
    // Could extract it, but its only used here and in the method aboveonFailure
    const controls = Object.keys(this.state)
        .filter((k) => k.endsWith('OK') && this.state[k] !== null && typeof this.state[k] !== 'undefined')
        .map((k) => ({
          [k]: this.state[k]
        }));
    // Create a nice representation of the control state
    const controlState = {
      ...flatten(controls),
      doneBy: this.state.doneBy,
      doneDate: this.state.doneDate
    };
    if (this.oneStateIsNotOK()) {
      // push a new path onto the history, with the provided nice control state
      hashHistory.replace({
        pathname: `/magasin/${this.props.params.id}/observation/edit`,
        state: controlState
      });
    } else {
      this.props.saveControl(this.props.params.id, this.props.user.museumId, controlState, {
        onSuccess: () => {
          hashHistory.goBack();
          emitSuccess({ type: 'saveSuccess', message: I18n.t('musit.newControl.saveControlSuccess')});
        },
        onFailure: (e) => emitError({...e, type: 'network'})
      });
    }
  }

  setDate = (newValue) => {
    if (newValue) {
      if (isDateBiggerThanToday(newValue)) {
        emitError({ type: 'dateValidationError', message: I18n.t('musit.newControl.dateValidation') });
        this.setState({ ...this.state, doneDate: new Date().toISOString() });
      } else {
        this.setState({ ...this.state, doneDate: newValue });
      }
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const errors = [];
    const controls = Object.keys(this.state).filter((k) => k.endsWith('OK') && this.state[k] !== null);
    if (controls.length === 0) {
      errors.push(I18n.t('musit.newControl.controlsRequired'));
    }
    if (!this.state.doneBy) {
      errors.push(I18n.t('musit.newControl.doneByRequired'));
    }
    if (!this.state.doneDate) {
      errors.push(I18n.t('musit.newControl.dateRequired'));
    }
    if (errors.length === 0) {
      this.onClickSave();
    } else {
      this.setState({ ...this.state, errors });
    }
  }

  render() {
    const breadcrumb = <Breadcrumb node={this.props.rootNode} disabled />;

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
    ];

    const renderReadOnly = (e) => {
      const make = (v) => <FormControl style={{ backgroundColor: '#f2f2f2' }} readOnly value={v} />;

      if (hasProp(e, 'leftValue') && hasProp(e, 'rightValue')) {
        return <div>
          <Col xs={5}>
            {make(e.leftValue)}
          </Col>
          <Col xs={4}>
            {make(e.rightValue)}
          </Col>
        </div>;
      }

      if (hasProp(e, 'leftValue')) {
        return <Col md={9}>{make(e.leftValue)}</Col>;
      }

      return <Col md={9}>{null}</Col>;
    };

    return (
      <Layout
        title="Magasin"
        breadcrumb={breadcrumb}
        content={
          <form onSubmit={this.handleSubmit}>
            <h4 style={{ textAlign: 'center' }}>{I18n.t('musit.newControl.title', false)}</h4>
            <Grid>
              <Row>
                <Col xs={3}>
                  <Col xs={2} />
                  <Col xs={10}>
                    <Row>
                      <Col xs={12}>
                        <label>
                          {I18n.t('musit.newControl.date')}
                        </label>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        <DatePicker
                          dateFormat={DATE_FORMAT_DISPLAY}
                          value={this.state.doneDate}
                          onClear={(newValue) => this.setState({ ...this.state, doneDate: newValue })}
                          onChange={newValue => {
                            this.setDate(newValue);
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
                        {I18n.t('musit.newControl.doneBy')}
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
                          this.setState({
                            ...this.state,
                            doneBy: newValue
                          });
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
                        label={I18n.t(`musit.newControl.${e.key}`)}
                        value={this.state[`${e.key}OK`]}
                        updatevalueOK={this.onControlClickOK(`${e.key}OK`)}
                        updatevalueNotOK={this.onControlClickNOK(`${e.key}OK`)}
                      />
                    </Col>
                    <Col xs={9}>
                      <Row>
                        <Col xs={5}>
                          {hasProp(e, 'leftValue') ?
                            <label> {I18n.t('musit.newControl.envdata')} </label> : ''
                          }
                        </Col>
                      </Row>
                      <Row>
                        {renderReadOnly(e)}
                      </Row>
                    </Col>
                  </Row>
                );
              })}
              <hr />
              {this.state.errors && this.state.errors.map((e, i) => {
                return <center><span key={i} style={{ color: 'red' }}>{e}</span></center>;
              })}
              <hr />
              <SaveCancel
                saveLabel={I18n.t(this.oneStateIsNotOK() ? 'musit.newControl.registerObservations' : 'musit.texts.save')}
                onClickSave={(e) => this.handleSubmit(e)}
                onClickCancel={() => hashHistory.goBack() }
              />
            </Grid>
          </form>
        }
      />
    );
  }
}
