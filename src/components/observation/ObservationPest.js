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
    // Lifecycle
    lifeCycleLabel: PropTypes.string.isRequired,
    lifeCyclePlaceHolder: PropTypes.string.isRequired,
    lifeCycleTooltip: PropTypes.string.isRequired,
    lifeCycleValidate: PropTypes.string,
    lifeCycleItems: PropTypes.array.isRequired,
    lifeCycleOnChange: PropTypes.func.isRequired,
    lifeCycleOnRemove: PropTypes.func.isRequired,
    // Count
    countLabel: PropTypes.string.isRequired,
    countPlaceHolder: PropTypes.string.isRequired,
    countTooltip: PropTypes.string.isRequired,
    countValidate: PropTypes.string,
    countPrecision: PropTypes.number,
    countOnChange: PropTypes.func.isRequired,
    // Comments
    commentsLeftValue: PropTypes.string,
    commentsLeftLabel: PropTypes.string.isRequired,
    commentsLeftTooltip: PropTypes.string.isRequired,
    commentsLeftPlaceHolder: PropTypes.string,
    commentsOnChangeLeft: PropTypes.func.isRequired,
    commentsRightValue: PropTypes.string,
    commentsRightLabel: PropTypes.string.isRequired,
    commentsRightTooltip: PropTypes.string.isRequired,
    commentsRightPlaceHolder: PropTypes.string,
    commentsOnChangeRight: PropTypes.func.isRequired,
    // New button
    newButtonLabel: PropTypes.string.isRequired,
    newButtonOnClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    disabled: false,
    canEdit: true,
    lifeCycleValidate: 'text',
    countValidate: 'number',
    countPrecision: 0,
    commentsLeftValue: '',
    commentsRightValue: ''
  }

  render() {
    return (
      <div>
        <ObservationDoubleTextAreaComponent
          leftValue={this.props.commentsLeftValue}
          leftLabel={this.props.commentsLeftLabel}
          leftTooltip={this.props.commentsLeftTooltip}
          leftPlaceHolder={this.props.commentsLeftPlaceHolder}
          onChangeLeft={this.props.commentsOnChangeLeft}
          rightValue={this.props.commentsRightValue}
          rightLabel={this.props.commentsRightLabel}
          rightTooltip={this.props.commentsRightTooltip}
          rightPlaceHolder={this.props.commentsRightPlaceHolder}
          onChangeRight={this.props.commentsOnChangeRight}
          disabled={this.props.disabled}
        />
        <span>
          <ControlLabel>{'\u00A0'}</ControlLabel><br />
          {!this.props.canEdit ? '' :
            <Button onClick={this.props.newButtonOnClick}>
              <FontAwesome name="plus-circle" />&nbsp;{this.props.newButtonLabel}
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
                    {this.props.lifeCycleLabel}
                    &nbsp;{!this.props.disabled ? <span style={{ color: 'red' }}>*</span> : ''}
                    &nbsp;{!this.props.canEdit ? '' :
                      <FontAwesome onClick={() => this.props.lifeCycleOnRemove(index)} name="times" />}
                  </ControlLabel>
                  <MusitDropDownField
                    items={this.props.lifeCycleItems}
                    placeHolder={this.props.lifeCyclePlaceHolder}
                    tooltip={this.props.lifeCycleTooltip}
                    validate={this.props.lifeCycleValidate}
                    minimumLength={1}
                    disabled={this.props.disabled}
                    value={observation.lifeCycle}
                    onChange={(lifeCycleValue) => this.props.lifeCycleOnChange(index, lifeCycleValue)}
                  />
                </span>
              </Col>
              <Col xs={6} sm={3} md={3}>
                <span>
                  <ControlLabel>
                    {this.props.countLabel}
                    &nbsp;{!this.props.disabled ? <span style={{ color: 'red' }}>*</span> : ''}
                  </ControlLabel>
                  <MusitField
                    placeHolder={this.props.countPlaceHolder}
                    tooltip={this.props.countTooltip}
                    validate={this.props.countValidate}
                    precision={this.props.countPrecision}
                    disabled={this.props.disabled}
                    value={observation.count}
                    onChange={(countValue) => this.props.countOnChange(index, countValue)}
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
