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
import { MusitTextArea } from '../../components/formfields'
import { Row, ControlLabel, Col } from 'react-bootstrap'

export default class ObservationDoubleTextAreaComponent extends Component {
  static propTypes = {
    leftLabel: PropTypes.string.isRequired,
    leftValue: PropTypes.string.isRequired,
    leftTooltip: PropTypes.string.isRequired,
    leftPlaceHolder: PropTypes.string.isRequired,
    onChangeLeft: PropTypes.func.isRequired,
    rightLabel: PropTypes.string.isRequired,
    rightValue: PropTypes.string.isRequired,
    rightTooltip: PropTypes.string.isRequired,
    rightPlaceHolder: PropTypes.string.isRequired,
    onChangeRight: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    leftValue: '',
    leftPlaceHolder: '',
    rightValue: '',
    rightPlaceHolder: ''
  }

  constructor(props) {
    super(props)
    const { leftTooltip, onChangeLeft, leftPlaceHolder, rightTooltip, onChangeRight, rightPlaceHolder, disabled } = props
    this.fields = {
      left: {
        placeHolder: leftPlaceHolder,
        tooltip: leftTooltip,
        onChange: onChangeLeft,
        validate: 'text',
        maximumLength: 100,
        minimumLength: 1,
        numberOfRows: 5,
        disabled: disabled
      },
      right: {
        placeHolder: rightPlaceHolder,
        tooltip: rightTooltip,
        onChange: onChangeRight,
        validate: 'text',
        maximumLength: 250,
        numberOfRows: 5,
        disabled: disabled
      }
    }
  }

  render() {
    const { left, right } = this.fields
    const { leftValue, rightValue, leftLabel, rightLabel } = this.props

    return (
      <Row>
        <Col xs={12} sm={6}>
          <ControlLabel>{leftLabel}</ControlLabel>
          <MusitTextArea {...left} value={leftValue} />
        </Col>
        <Col xs={12} sm={6}>
          <ControlLabel>{rightLabel}</ControlLabel>
          <MusitTextArea {...right} value={rightValue} />
        </Col>
      </Row>
    )
  }
}
