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

import * as React from 'react';
import { Component } from 'react';
import ObservationDoubleTextAreaComponent from './ObservationDoubleTextAreaComponent';
import { MusitField, MusitDropDownField } from '../../../components/formfields';
import { ControlLabel, Row, Col, Button } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import { TODO } from '../../../types/common';

interface ObservationPestProps {
  disabled?: boolean;
  canEdit?: boolean;
  observations: Array<{
    count?: string;
    lifeCycle?: string;
  }>;
  // Lifecycle
  lifeCycleLabel: string;
  lifeCyclePlaceHolder: string;
  lifeCycleTooltip: string;
  lifeCycleValidate?: string;
  lifeCycleItems: Array<TODO>;
  lifeCycleItemsTranslateKeyPrefix?: string;
  lifeCycleWidth: number;
  lifeCycleOnChange: Function;
  lifeCycleOnRemove: Function;
  // Count
  countLabel: string;
  countPlaceHolder: string;
  countTooltip: string;
  countValidate?: string;
  countPrecision?: number;
  countWidth: number;
  countOnChange: Function;
  // Comments
  commentsLeftValue?: string;
  commentsLeftLabel: string;
  commentsLeftTooltip: string;
  commentsLeftPlaceHolder: string; //Made it required because it is used in a required property.
  commentsLeftWidth: number;
  commentsOnChangeLeft: Function;
  commentsRightValue?: string;
  commentsRightLabel: string;
  commentsRightTooltip: string;
  commentsRightPlaceHolder: string; //Made it required because it is used in a required property.
  commentsRightWidth: number;
  commentsOnChangeRight: Function;
  // New button
  newButtonLabel: string;
  newButtonOnClick: React.MouseEventHandler<Button>;
  // icons:
  removeIconWidth: number;
  addIconWidth: number;
}

/* Old:
static propTypes = {
    disabled: PropTypes.bool,
    canEdit: PropTypes.bool,
    observations: PropTypes.arrayOf(
      PropTypes.shape({
        count?: string;
        lifeCycle: PropTypes.string
      })
    ).isRequired,
    // Lifecycle
    lifeCycleLabel: PropTypes.string.isRequired,
    lifeCyclePlaceHolder: PropTypes.string.isRequired,
    lifeCycleTooltip: PropTypes.string.isRequired,
    lifeCycleValidate: PropTypes.string,
    lifeCycleItems: PropTypes.array.isRequired,
    lifeCycleItemsTranslateKeyPrefix: PropTypes.string,
    lifeCycleWidth: PropTypes.number.isRequired,
    lifeCycleOnChange: PropTypes.func.isRequired,
    lifeCycleOnRemove: PropTypes.func.isRequired,
    // Count
    countLabel: PropTypes.string.isRequired,
    countPlaceHolder: PropTypes.string.isRequired,
    countTooltip: PropTypes.string.isRequired,
    countValidate: PropTypes.string,
    countPrecision: PropTypes.number,
    countWidth: PropTypes.number.isRequired,
    countOnChange: PropTypes.func.isRequired,
    // Comments
    commentsLeftValue: PropTypes.string,
    commentsLeftLabel: PropTypes.string.isRequired,
    commentsLeftTooltip: PropTypes.string.isRequired,
    commentsLeftPlaceHolder: PropTypes.string,
    commentsLeftWidth: PropTypes.number.isRequired,
    commentsOnChangeLeft: PropTypes.func.isRequired,
    commentsRightValue: PropTypes.string,
    commentsRightLabel: PropTypes.string.isRequired,
    commentsRightTooltip: PropTypes.string.isRequired,
    commentsRightPlaceHolder: PropTypes.string,
    commentsRightWidth: PropTypes.number.isRequired,
    commentsOnChangeRight: PropTypes.func.isRequired,
    // New button
    newButtonLabel: PropTypes.string.isRequired,
    newButtonOnClick: PropTypes.func.isRequired,
    // icons:
    removeIconWidth: PropTypes.number.isRequired,
    addIconWidth: PropTypes.number.isRequired
  };
*/

export default class ObservationPest extends Component<ObservationPestProps> {
  static defaultProps: Partial<ObservationPestProps> = {
    disabled: false,
    canEdit: true,
    lifeCycleValidate: 'text',
    countValidate: 'number',
    countPrecision: 0,
    commentsLeftValue: '',
    commentsRightValue: ''
  };

  render() {
    return (
      <div>
        <ObservationDoubleTextAreaComponent
          leftValue={this.props.commentsLeftValue || ""} //TODO: Check if ok with empty string
          leftLabel={this.props.commentsLeftLabel}
          leftTooltip={this.props.commentsLeftTooltip}
          leftPlaceHolder={this.props.commentsLeftPlaceHolder}
          leftWidth={this.props.commentsLeftWidth}
          onChangeLeft={this.props.commentsOnChangeLeft}
          rightValue={this.props.commentsRightValue || ""} //TODO: Check if ok with empty string
          rightLabel={this.props.commentsRightLabel}
          rightTooltip={this.props.commentsRightTooltip}
          rightPlaceHolder={this.props.commentsRightPlaceHolder}
          rightWidth={this.props.commentsRightWidth}
          onChangeRight={this.props.commentsOnChangeRight}
          disabled={this.props.disabled}
        />
        <hr />
        {this.props.observations.map((observation, index) => {
          return (
            <Row key={index}>
              <Col xs={6} sm={this.props.lifeCycleWidth} md={this.props.lifeCycleWidth}>
                <span style={{ height: 50 }}>
                  <ControlLabel>{this.props.lifeCycleLabel}</ControlLabel>
                  <MusitDropDownField
                    items={this.props.lifeCycleItems}
                    translateKeyPrefix={this.props.lifeCycleItemsTranslateKeyPrefix}
                    placeHolder={
                      !this.props.disabled ? this.props.lifeCyclePlaceHolder : ''
                    }
                    tooltip={this.props.lifeCycleTooltip}
                    validate={this.props.lifeCycleValidate}
                    disabled={this.props.disabled}
                    value={observation.lifeCycle}
                    onChange={(lifeCycleValue: TODO) =>
                      this.props.lifeCycleOnChange(index, lifeCycleValue)
                    }
                  />
                </span>
              </Col>
              <Col xs={6} sm={this.props.countWidth} md={this.props.countWidth}>
                <span>
                  <ControlLabel>{this.props.countLabel}</ControlLabel>
                  <MusitField
                    placeHolder={!this.props.disabled ? this.props.countPlaceHolder : ''}
                    tooltip={this.props.countTooltip}
                    validate={this.props.countValidate}
                    precision={this.props.countPrecision}
                    disabled={this.props.disabled}
                    value={observation.count}
                    onChange={(countValue: TODO) =>
                      this.props.countOnChange(index, countValue)
                    }
                    style={{ height: 36 }}
                  />
                </span>
              </Col>
              <Col xs={1} sm={this.props.removeIconWidth} md={this.props.removeIconWidth}>
                <ControlLabel>{'\u00A0'}</ControlLabel>
                <br />
                {!this.props.canEdit ? (
                  ''
                ) : (
                  <Button bsStyle="link">
                    <FontAwesome
                      onClick={e => {
                        this.props.lifeCycleOnRemove(index);
                        e.preventDefault();
                      }}
                      name="times"
                    />
                  </Button>
                )}
              </Col>
              <Col xs={1} sm={this.props.addIconWidth} md={this.props.addIconWidth}>
                <span style={{ height: 50 }}>
                  <ControlLabel>{'\u00A0'}</ControlLabel>
                  <br />
                  {!this.props.canEdit ? (
                    ''
                  ) : (
                    <Button onClick={this.props.newButtonOnClick}>
                      <FontAwesome name="plus-circle" />
                      &nbsp;
                      {this.props.newButtonLabel}
                    </Button>
                  )}
                </span>
              </Col>
            </Row>
          );
        })}
      </div>
    );
  }
}
