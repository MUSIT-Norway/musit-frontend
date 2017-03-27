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

import React, {PropTypes} from 'react';
import {Button, Row, Col} from 'react-bootstrap';
import {I18n} from 'react-i18nify';


export default function SaveCancel(props) {
  const save = {
    id: `Save_${props.id || 1}`,
    onClick: props.onClickSave,
    className: 'submitButton',
    bsStyle: 'primary'
  };
  const cancel = {
    id: `Cancel_${props.id || 1}`,
    onClick: props.onClickCancel,
    className: 'cancelButton',
    bsStyle: 'link'
  };

  return (
    <Row>
      <Col xs={6} sm={5} md={2} mdOffset={3} style={{ border: 'none', textAlign: 'center' }}>
        <Button
          {...save}
          disabled={props.saveDisabled}
        >
          {props.saveLabel || I18n.t('musit.texts.save')}
        </Button>
      </Col>
      <Col xs={6} sm={5} md={2} style={{ border: 'none', textAlign: 'center' }}>
        <Button
          {...cancel}
          disabled={props.cancelDisabled}
        >
          {props.cancelLabel || I18n.t('musit.texts.cancel')}
        </Button>
      </Col>
    </Row>
  );
}

SaveCancel.propTypes = {
  id: PropTypes.string,
  saveLabel: PropTypes.string,
  saveDisabled: PropTypes.bool,
  onClickSave: PropTypes.func,
  cancelLabel: PropTypes.string,
  cancelDisabled: PropTypes.bool,
  onClickCancel: PropTypes.func
};

SaveCancel.displayName = 'SaveCancel';