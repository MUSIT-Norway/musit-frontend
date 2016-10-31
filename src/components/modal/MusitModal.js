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

import React, {PropTypes} from 'react'
import './MusitModal.css'

const MusitModal = (props) => {
  const extraClassName = props.className ? ' ' + props.className : '';
  return (
    <div
      className={`musit-modal${extraClassName}`}
      style={{...props.style}}
    >
      {props.header &&
        <div className="musit-modal-header">
          {props.header}
        </div>
      }
      <div className="musit-modal-body">
        {props.body}
      </div>
      <div className="musit-modal-footer">
        {props.footer}
      </div>
    </div>
  );
};

MusitModal.contextTypes = {
  closeModal: PropTypes.func.isRequired
};

export default MusitModal;