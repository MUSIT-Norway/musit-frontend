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
import React from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col, FormControl } from "react-bootstrap";
import PairedToogleButtons from "./ToggleButtons";
import DatePicker from "../../components/DatePicker";
import SaveCancel from "../../components/formfields/saveCancel/SaveCancel";
import {
  flatten,
  DATE_FORMAT_DISPLAY,
  hasProp,
  isDateBiggerThanToday,
  formatISOString
} from "../../shared/util";
import { ActorSuggest } from "../../components/suggest/ActorSuggest";
import Layout from "../../components/layout";
import Breadcrumb from "../../components/layout/Breadcrumb";
import { emitError, emitSuccess } from "../../shared/errors";
import { I18n } from "react-i18nify";
import { RxInjectLegacy as inject } from "../../shared/react-rxjs-patch/";
import Control from "../../models/control";
import store$, { loadRootNode$ } from "./controlStore";
import Loader from "react-loader";
import Config from "../../config";

export class ControlAddContainer extends React.Component {
  static propTypes = {
    addControl: PropTypes.func.isRequired,
    match: PropTypes.object,
    appSession: PropTypes.object,
    envReqData: PropTypes.object,
    rootNode: PropTypes.object,
    goBack: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.onControlClick = this.onControlClick.bind(this);
    this.onControlClickOK = this.onControlClickOK.bind(this);
    this.onControlClickNOK = this.onControlClickNOK.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    if (!this.props.store.rootNode) {
      this.props.loadRootNode({
        id: this.props.match.params.id,
        museumId: this.props.appSession.museumId,
        token: this.props.appSession.accessToken
      });
    } else {
      this.setStateBasedOnRootNode(this.props.store.rootNode);
    }
  }

  componentWillReceiveProps(next) {
    if (next.store.rootNode && !this.props.store.rootNode) {
      this.setStateBasedOnRootNode(next.store.rootNode);
    }
  }

  setStateBasedOnRootNode(rootNode) {
    const requirement = rootNode.environmentRequirement;
    this.setState(() => ({
      temperature: requirement ? requirement.temperature : " ",
      temperatureTolerance: requirement
        ? requirement.temperatureTolerance
        : " ",
      relativeHumidity: requirement ? requirement.relativeHumidity : " ",
      relativeHumidityInterval: requirement
        ? requirement.relativeHumidityTolerance
        : " ",
      inertAir: requirement ? requirement.hypoxicAir : " ",
      inertAirInterval: requirement ? requirement.hypoxicAirTolerance : " ",
      light: requirement ? requirement.lightingCondition : " ",
      cleaning: requirement ? requirement.cleaning : " ",
      doneDate: this.props.doneDate
        ? this.props.doneDate
        : formatISOString(new Date()),
      doneBy: this.props.appSession.actor
    }));
  }

  onControlClick(key, bool) {
    return () => {
      if (this.state[key] != null && this.state[key] === bool) {
        this.setState(ps => ({ ...ps, [key]: null }));
      } else {
        this.setState(ps => ({ ...ps, [key]: bool }));
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
    return (
      Object.keys(this.state).filter(
        k => k.endsWith("OK") && this.state[k] === false
      ).length > 0
    );
  }

  onClickSave() {
    // Could extract it, but its only used here and in the method aboveonFailure
    const controls = Object.keys(this.state)
      .filter(
        k =>
          k.endsWith("OK") &&
          this.state[k] !== null &&
          typeof this.state[k] !== "undefined"
      )
      .map(k => ({
        [k]: this.state[k]
      }));
    // Create a nice representation of the control state
    const controlState = {
      ...flatten(controls),
      doneBy: this.state.doneBy,
      doneDate: this.state.doneDate
    };
    if (this.oneStateIsNotOK()) {
      this.props.editObservation(this.props.appSession, controlState);
    } else {
      this.props
        .addControl({
          nodeId: this.props.match.params.id,
          museumId: this.props.appSession.museumId,
          controlData: controlState,
          token: this.props.appSession.accessToken,
          callback: {
            onComplete: () => {
              this.props.goBack();
              emitSuccess({
                type: "saveSuccess",
                message: I18n.t("musit.newControl.saveControlSuccess")
              });
            },
            onFailure: e => emitError({ ...e, type: "network" })
          }
        })
        .toPromise();
    }
  }

  setDate = newValue => {
    if (newValue) {
      if (isDateBiggerThanToday(newValue)) {
        emitError({
          type: "dateValidationError",
          message: I18n.t("musit.newControl.dateValidation")
        });
        this.setState(ps => ({ ...ps, doneDate: formatISOString(new Date()) }));
      } else {
        this.setState(ps => ({ ...ps, doneDate: newValue }));
      }
    }
  };

  handleSubmit(event) {
    event.preventDefault();
    const errors = [];
    const controls = Object.keys(this.state).filter(
      k => k.endsWith("OK") && this.state[k] !== null
    );
    if (controls.length === 0) {
      errors.push(I18n.t("musit.newControl.controlsRequired"));
    }
    if (!this.state.doneBy) {
      errors.push(I18n.t("musit.newControl.doneByRequired"));
    }
    if (!this.state.doneDate) {
      errors.push(I18n.t("musit.newControl.dateRequired"));
    }
    if (errors.length === 0) {
      this.onClickSave();
    } else {
      this.setState(ps => ({ ...ps, errors }));
    }
  }

  render() {
    if (!this.state) {
      return <Loader loaded={false} />;
    }
    const breadcrumb = <Breadcrumb node={this.props.store.rootNode} disabled />;
    const translate = k => I18n.t(k);

    const fields = [
      {
        key: "temperature",
        leftValue: this.state.temperature,
        rightValue: this.state.temperatureTolerance
      },
      {
        key: "relativeHumidity",
        leftValue: this.state.relativeHumidity,
        rightValue: this.state.relativeHumidityInterval
      },
      {
        key: "hypoxicAir",
        leftValue: this.state.inertAir,
        rightValue: this.state.inertAirInterval
      },
      {
        key: "lightCondition",
        leftValue: this.state.light
      },
      {
        key: "cleaning",
        leftValue: this.state.cleaning
      },
      { key: "gas" },
      { key: "alcohol" },
      { key: "mold" },
      { key: "pest" }
    ];

    const renderReadOnly = e => {
      const make = v => (
        <FormControl
          style={{ backgroundColor: "#f2f2f2" }}
          readOnly
          value={v}
        />
      );

      if (hasProp(e, "leftValue") && hasProp(e, "rightValue")) {
        return (
          <div>
            <Col xs={5}>{make(e.leftValue)}</Col>
            <Col xs={4}>{make(e.rightValue)}</Col>
          </div>
        );
      }

      if (hasProp(e, "leftValue")) {
        return <Col md={9}>{make(e.leftValue)}</Col>;
      }

      return <Col md={9}>{null}</Col>;
    };

    return (
      <Layout
        title={I18n.t("musit.storageUnits.title")}
        breadcrumb={breadcrumb}
        content={
          <form onSubmit={this.handleSubmit}>
            <h4 style={{ textAlign: "center" }}>
              {I18n.t("musit.newControl.title", false)}
            </h4>
            <Grid>
              <Row>
                <Col xs={3}>
                  <Col xs={2} />
                  <Col xs={10}>
                    <Row>
                      <Col xs={12}>
                        <label>{translate("musit.newControl.date")}</label>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        <DatePicker
                          dateFormat={DATE_FORMAT_DISPLAY}
                          value={this.state.doneDate}
                          onClear={newValue =>
                            this.setState(ps => ({
                              ...ps,
                              doneDate: newValue
                            }))}
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
                      <label>{translate("musit.newControl.doneBy")}</label>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={9}>
                      <ActorSuggest
                        appSession={this.props.appSession}
                        id="doneByField"
                        value={this.state.doneBy ? this.state.doneBy.fn : ""}
                        placeHolder="Find actor"
                        onChange={newValue => {
                          this.setState(ps => ({
                            ...ps,
                            doneBy: newValue
                          }));
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
                          {hasProp(e, "leftValue") ? (
                            <label>
                              {translate("musit.newControl.envdata")}
                            </label>
                          ) : (
                            ""
                          )}
                        </Col>
                      </Row>
                      <Row>{renderReadOnly(e)}</Row>
                    </Col>
                  </Row>
                );
              })}
              <hr />
              {this.state.errors &&
                this.state.errors.map((e, i) => {
                  return (
                    <center>
                      <span key={i} style={{ color: "red" }}>
                        {e}
                      </span>
                    </center>
                  );
                })}
              <hr />
              <SaveCancel
                saveLabel={translate(
                  this.oneStateIsNotOK()
                    ? "musit.newControl.registerObservations"
                    : "musit.texts.save"
                )}
                saveDisabled={
                  !this.props.appSession.rolesForModules.storageFacilityWrite
                }
                translate={translate}
                onClickSave={e => this.handleSubmit(e)}
                onClickCancel={() => this.props.goBack()}
              />
            </Grid>
          </form>
        }
      />
    );
  }
}

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  store$
};

const commands = {
  loadRootNode$
};

const props = props => ({
  ...props,
  addControl: Control.addControl(),
  goBack: props.history.goBack,
  editObservation: (appSession, controlState) =>
    props.history.replace({
      pathname: Config.magasin.urls.client.storagefacility.editObservation(
        props.match.params.id,
        props.appSession
      ),
      state: controlState
    })
});

export default inject(data, commands, props)(ControlAddContainer);
