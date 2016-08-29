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
import { MusitField, MusitTextArea } from '../../components/formfields'
import { Row, ControlLabel, Col } from 'react-bootstrap'

export default class ObservationFromToNumberCommentComponent extends Component {
  static propTypes = {
    // From
    fromLabel: PropTypes.string.isRequired,
    fromValue: PropTypes.string.isRequired,
    fromTooltip: PropTypes.string.isRequired,
    fromPlaceHolder: PropTypes.string,
    onChangeFrom: PropTypes.func.isRequired,
    // To
    toLabel: PropTypes.string.isRequired,
    toValue: PropTypes.string.isRequired,
    toTooltip: PropTypes.string.isRequired,
    toPlaceHolder: PropTypes.string,
    onChangeTo: PropTypes.func.isRequired,
    // Comment
    commentLabel: PropTypes.string.isRequired,
    commentValue: PropTypes.string.isRequired,
    commentTooltip: PropTypes.string.isRequired,
    commentPlaceholder: PropTypes.string,
    onChangeComment: PropTypes.func.isRequired,
    // Other
    disabled: PropTypes.bool
  }

  static defaultProps = {
    fromValue: '',
    toValue: '',
    commentValue: ''
  }

  render() {
    return (
      <Row>
        <Col xs={12} sm={3}>
          <ControlLabel>{this.props.fromLabel}</ControlLabel>
          <MusitField
            value={this.props.fromValue}
            tooltip={this.props.fromTooltip}
            placeHolder={this.props.fromPlaceHolder}
            validate={'number'}
            precision={3}
            onChange={this.props.onChangeFrom}
            disabled={this.props.disabled}
          />
        </Col>
        <Col xs={12} sm={3}>
          <ControlLabel>{this.props.toLabel}</ControlLabel>
          <MusitField
            value={this.props.toValue}
            tooltip={this.props.toTooltip}
            placeHolder={this.props.toPlaceHolder}
            validate={'number'}
            precision={3}
            onChange={this.props.onChangeTo}
            disabled={this.props.disabled}
          />
        </Col>
        <Col xs={12} sm={6}>
          <ControlLabel>{this.props.commentLabel}</ControlLabel>
          <MusitTextArea
            value={this.props.commentValue}
            tooltip={this.props.commentTooltip}
            placeHolder={this.props.commentPlaceholder}
            validate={'text'}
            maximumLength={250}
            numberOfRows={5}
            onChange={this.props.onChangeComment}
            disabled={this.props.disabled}
          />
        </Col>
      </Row>
    )
  }
}
