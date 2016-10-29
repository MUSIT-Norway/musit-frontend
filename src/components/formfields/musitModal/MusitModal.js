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

import React, {Component, PropTypes} from 'react'
import { Row, Col} from 'react-bootstrap'
import Breadcrumb from '../../../layout/Breadcrumb'
import ModalNodeGrid from '../../../components/grid/ModalNodeGrid'
import SaveCancel from '../../../components/formfields/saveCancel/SaveCancel'
import NodeSuggest from '../../../components/nodesearch'
import './index.css'

export default class MusitModal extends Component {

  static propTypes = {
    onMove: PropTypes.func.isRequired,
    loadNode: PropTypes.func.isRequired,
    loadChildren: PropTypes.func.isRequired,
    loadRootChildren: PropTypes.func.isRequired,
    clearRoot: PropTypes.func.isRequired,
    setCurrentId: PropTypes.func.isRequired,
    clearCurrentId: PropTypes.func.isRequired,
    currentId: PropTypes.number,
    translate: PropTypes.func,
    children: PropTypes.arrayOf(PropTypes.object),
    rootNode: PropTypes.object
  }

  static contextTypes = {
    closeModal: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.loadHome()
  }

  loadHome() {
    this.props.clearRoot()
    this.props.loadRootChildren();
    this.props.clearCurrentId();
  }

  loadNode(initialId) {
    this.props.loadNode(initialId)
    this.props.loadChildren(initialId)
    this.props.setCurrentId(initialId)
  }

  render() {
    const {children, rootNode} = this.props
    return (
      <div className="musit-modal">
        <div className="musit-modal-header">
          <Row className="row-centered">
            <Col sm={2}>&nbsp;</Col>
            <Col sm={8}>
              <NodeSuggest
                label="Search"
                id="nodeSearch"
                onChange={ (v) => v ? this.loadNode(v) : null }
                placeHolder={this.props.translate('musit.moveModal.nodeSuggestPlaceholder')}
              />
            </Col>
            <Col sm={2}>&nbsp;</Col>
          </Row>
        </div>
        <div className="musit-modal-body" style={{ minHeight: 300 }}>
          { children && children.length > 0 ?
            <ModalNodeGrid
              tableData={children}
              onClick={(node) => this.loadNode(node.id)}
            /> :
            <div style={{ textAlign: 'center', color: 'grey' }}>{this.props.translate('musit.moveModal.noData')}</div>
          }
        </div>
        <div className="musit-modal-footer">
          <Row style={{ textAlign: 'center' }}>
            <Col>
              {this.props.translate('musit.moveModal.currentDestination')}
            </Col>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <Col>
              <Breadcrumb
                node={rootNode}
                onClickCrumb={(node) => {
                  node.id === -1 || !node.id ? this.loadHome() : this.loadNode(node.id)
                }}
              />
            </Col>
          </Row>
          <br />
          <Row style={{ textAlign: 'center' }}>
            <Col xs={4} sm={4} smOffset={4}>
              <SaveCancel
                translate={this.props.translate}
                saveLabel={this.props.translate('musit.moveModal.move')}
                saveDisabled={!this.props.currentId}
                onClickSave={(e) => {
                  e.preventDefault()
                  this.props.onMove(
                    rootNode.id,
                    rootNode.name,
                    this.context.closeModal
                  );
                }}
                onClickCancel={this.context.closeModal}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
