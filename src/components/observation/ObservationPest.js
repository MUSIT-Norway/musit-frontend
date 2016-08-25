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

import React, { Component, PropTypes } from 'react'
import { ObservationDoubleTextAreaComponent } from './index'
import { MusitField, MusitDropDownField } from '../../components/formfields'
import { ControlLabel, Row, Col, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

export default class ObservationPest extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    canEdit: PropTypes.bool,
    observations: PropTypes.array.isRequired,
    lifeCycle: PropTypes.shape({
      label: PropTypes.string.isRequired,
      placeHolder: PropTypes.string.isRequired,
      tooltip: PropTypes.string.isRequired,
      validate: PropTypes.string,
      items: PropTypes.array.isRequired,
      onChange: PropTypes.func.isRequired,
      onRemove: PropTypes.func.isRequired
    }).isRequired,
    count: PropTypes.shape({
      label: PropTypes.string.isRequired,
      placeHolder: PropTypes.string.isRequired,
      tooltip: PropTypes.string.isRequired,
      validate: PropTypes.string,
      onChange: PropTypes.func.isRequired
    }).isRequired,
    comments: PropTypes.shape({
      leftValue: PropTypes.string,
      leftLabel: PropTypes.string.isRequired,
      leftTooltip: PropTypes.string.isRequired,
      onChangeLeft: PropTypes.func.isRequired,
      rightValue: PropTypes.string,
      rightLabel: PropTypes.string.isRequired,
      rightTooltip: PropTypes.string.isRequired,
      onChangeRight: PropTypes.func.isRequired
    }).isRequired,
    newButton: PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired
    }).isRequired
  }

  static defaultProps = {
    disabled: false,
    canEdit: true,
    lifeCycle: {
      validate: 'text'
    },
    count: {
      validate: 'number'
    },
    comments: {
      leftValue: '',
      rightValue: ''
    }
  }

  render() {
    return (
      <div>
        <ObservationDoubleTextAreaComponent {...this.props.comments} disabled={this.props.disabled} />
        <span>'
          <ControlLabel>{'\u00A0'}</ControlLabel><br />
          {!this.props.canEdit ? '' :
            <Button onClick={this.props.newButton.onClick}>
              <FontAwesome name="plus-circle" />&nbsp;{this.props.newButton.label}
            </Button>
          }
        </span>
        <hr />
        {this.props.observations.map((observation, index) => {
          return (
            <Row key={index}>
              <Col xs={6} sm={3} md={3}>
                <span style={{ height: 50 }}>
                  <ControlLabel>
                    {this.props.lifeCycle.label}&nbsp;
                    {!this.props.canEdit ? '' : <FontAwesome onClick={() => this.props.lifeCycle.onRemove(index)} name="times" />}
                  </ControlLabel>
                  <MusitDropDownField
                    {...this.props.lifeCycle}
                    disabled={this.props.disabled}
                    value={observation.lifeCycle}
                    onChange={(lifeCycleValue) => this.props.lifeCycle.onChange(index, lifeCycleValue)}
                  />
                </span>
              </Col>
              <Col xs={6} sm={3} md={3}>
                <span>
                  <ControlLabel>{this.props.count.label}</ControlLabel>
                  <MusitField
                    {...this.props.count}
                    disabled={this.props.disabled}
                    value={observation.count}
                    onChange={(countValue) => this.props.count.onChange(index, countValue)}
                    style={{ height: 36 }}
                  />
                </span>
              </Col>
            </Row>
          )
        })}
      </div>
    )
  }
}
