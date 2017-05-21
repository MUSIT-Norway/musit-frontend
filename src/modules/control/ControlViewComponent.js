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
import PropTypes from 'prop-types';
import { hashHistory } from 'react-router';
import { Grid, Row, Col, ControlLabel, Button } from 'react-bootstrap';
import ControlView from './ControlViewForm';
import { MusitField } from '../../components/formfields';
import Layout from '../../components/layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { parseISODate, DATE_FORMAT_DISPLAY } from '../../shared/util';
import { I18n } from 'react-i18nify';
import inject from 'react-rxjs/dist/RxInject';
import store$, { getControl$, loadRootNode$ } from './controlStore';
import Loader from 'react-loader';

export class ControlViewContainer extends React.Component {
  static propTypes = {
    controls: PropTypes.object,
    getControl: PropTypes.func.isRequired,
    params: PropTypes.object,
    rootNode: PropTypes.object
  };

  componentWillMount() {
    if (this.props.params.controlId) {
      this.props.getControl({
        nodeId: this.props.params.id,
        controlId: this.props.params.controlId,
        museumId: this.props.appSession.museumId,
        token: this.props.appSession.accessToken
      });
    }
    if (!this.props.store.rootNode) {
      this.props.loadRootNode({
        id: this.props.params.id,
        museumId: this.props.appSession.museumId,
        token: this.props.appSession.accessToken
      });
    }
  }

  getDate(data, field) {
    return data && data[field]
      ? parseISODate(data[field]).format(DATE_FORMAT_DISPLAY)
      : '';
  }

  render() {
    if (!this.props.store.data) {
      return <Loader loaded={false} />;
    }
    const data = this.props.store.data;
    return (
      <Layout
        title={I18n.t('musit.storageUnits.title')}
        breadcrumb={<Breadcrumb node={this.props.store.rootNode} disabled />}
        content={
          <div>
            <h4 style={{ textAlign: 'center' }}>{I18n.t('musit.viewControl.title')}</h4>
            <Grid>
              <Row>
                <Col sm={4} md={5}>
                  <ControlLabel>{I18n.t('musit.texts.datePerformed')}</ControlLabel>
                  <br />
                  <MusitField
                    onChange={() => true}
                    value={this.getDate(data, 'doneDate')}
                    disabled
                  />
                </Col>
                <Col sm={4} md={5}>
                  <ControlLabel>{I18n.t('musit.texts.performedBy')}</ControlLabel>
                  <br />
                  <MusitField
                    onChange={() => true}
                    value={data ? data.doneBy : ''}
                    disabled
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={4} md={5}>
                  <ControlLabel>{I18n.t('musit.texts.dateRegistered')}</ControlLabel>
                  <br />
                  <MusitField
                    onChange={() => true}
                    value={this.getDate(data, 'registeredDate')}
                    disabled
                  />
                </Col>
                <Col sm={4} md={5}>
                  <ControlLabel>{I18n.t('musit.texts.registeredBy')}</ControlLabel>
                  <br />
                  <MusitField
                    onChange={() => true}
                    value={data ? data.registeredBy : ''}
                    disabled
                  />
                </Col>
              </Row>
              <Row>
                <br />
              </Row>
              <Row>
                <Col sm={8} md={10}>
                  <ControlView id="1" controlsJson={data} />
                </Col>
              </Row>
              <Row
                className="row-centered"
                style={{ textAlign: 'center', border: '12px', borderColor: 'red' }}
              >
                <Col xs={10}>
                  <Button onClick={() => hashHistory.goBack()}>
                    {I18n.t('musit.texts.close')}
                  </Button>
                </Col>
              </Row>
            </Grid>
          </div>
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
  getControl$,
  loadRootNode$
};

export default inject(data, commands)(ControlViewContainer);
