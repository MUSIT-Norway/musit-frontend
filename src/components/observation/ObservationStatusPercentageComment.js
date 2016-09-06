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
import { MusitField, MusitTextArea, MusitDropDownField } from '../../components/formfields'
import { Row, ControlLabel, Col } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

export default class ObervationStatusPercentageComment extends Component {

  static propTypes = {
    // Status
    statusLabel: PropTypes.string.isRequired,
    statusPlaceHolder: PropTypes.string.isRequired,
    statusValue: PropTypes.string,
    statusItems: PropTypes.array.isRequired,
    statusTooltip: PropTypes.string,
    statusOnChange: PropTypes.func.isRequired,
    statusValidate: PropTypes.string,
    statusMinimumLength: PropTypes.number,
    // Volume
    volumeLabel: PropTypes.string,
    volumePlaceHolder: PropTypes.string,
    volumeValue: PropTypes.string,
    volumeTooltip: PropTypes.string,
    volumeOnChange: PropTypes.func.isRequired,
    volumeValidate: PropTypes.string,
    volumeMinimumLength: PropTypes.number,
    volumePrecision: PropTypes.number,
    // Comment
    commentLabel: PropTypes.string.isRequired,
    commentPlaceHolder: PropTypes.string.isRequired,
    commentValue: PropTypes.string,
    commentTooltip: PropTypes.string,
    commentOnChange: PropTypes.func.isRequired,
    commentValidate: PropTypes.string,
    commentMaximumLength: PropTypes.number,
    commentNumberOfRows: PropTypes.number,
    // Other
    disabled: PropTypes.bool
  }

  static defaultProps = {
    // Status
    statusValue: '',
    statusValidate: 'text',
    statusMinimumLength: 1,
    // Volume
    volumeValue: '',
    volumeTooltip: '',
    volumePlaceHolder: '%',
    volumeValidate: 'number',
    volumePrecision: 3,
    // Comment
    commentValue: '',
    commentTooltip: '',
    commentValidate: 'text',
    commentMaximumLength: 250,
    commentNumberOfRows: 5
  }

  render() {
    return (
      <Row>
        <Col xs={12} sm={2}>
          <ControlLabel>{this.props.statusLabel}&nbsp;<FontAwesome name="asterisk" style={{ color: 'red' }} /></ControlLabel>
          <MusitDropDownField
            value={this.props.statusValue}
            items={this.props.statusItems}
            tooltip={this.props.statusTooltip}
            placeHolder={this.props.statusPlaceHolder}
            validate={this.props.statusValidate}
            onChange={this.props.statusOnChange}
            minimumLength={this.props.statusMinimumLength}
            disabled={this.props.disabled}
          />
        </Col>
        <Col xs={12} sm={2}>
          <ControlLabel>{this.props.volumeLabel}</ControlLabel>
          <MusitField
            value={this.props.volumeValue}
            tooltip={this.props.volumeTooltip}
            placeHolder={this.props.volumePlaceHolder}
            validate={this.props.volumeValidate}
            onChange={this.props.volumeOnChange}
            minimumLength={this.props.volumeMinimumLength}
            precision={this.props.volumePrecision}
            disabled={this.props.disabled}
          />
        </Col>
        <Col xs={12} sm={6}>
          <ControlLabel>{this.props.commentLabel}</ControlLabel>
          <MusitTextArea
            value={this.props.commentValue}
            tooltip={this.props.commentTooltip}
            placeHolder={this.props.commentPlaceHolder}
            validate={this.props.commentValidate}
            onChange={this.props.commentOnChange}
            maximumLength={this.props.commentMaximumLength}
            numberOfRows={this.props.commentNumberOfRows}
            disabled={this.props.disabled}
          />
        </Col>
      </Row>
    )
  }
}
