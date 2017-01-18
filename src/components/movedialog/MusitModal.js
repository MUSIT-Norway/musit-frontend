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
import React, {Component, PropTypes} from 'react';
import Breadcrumb from '../../layout/Breadcrumb';
import ModalNodeGrid from './ModalNodeGrid';
import NodeSuggest from '../nodesearch';
import Modal from '../modal/MusitModal';
import SubmitButton from '../buttons/submit';
import CancelButton from '../buttons/cancel';
import { I18n } from 'react-i18nify';
import PagingToolbar from '../../util/paging';

const PER_PAGE = 10;

export default class MusitModal extends Component {

  static propTypes = {
    onMove: PropTypes.func.isRequired,
    loadNode: PropTypes.func.isRequired,
    loadChildren: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    children: PropTypes.arrayOf(PropTypes.object),
    totalNodes: PropTypes.number,
    selectedNode: PropTypes.object
  };

  static contextTypes = {
    closeModal: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      currentPage: 1
    };
  }

  componentDidMount() {
    this.loadHome();
  }

  loadHome() {
    this.props.clear();
    this.props.loadChildren(null, this.props.user.museumId);
  }

  loadNode(id, currentPage = 1) {
    this.setState({
      ...this.state,
      currentPage
    });
    this.props.loadNode(id, this.props.user.museumId);
    this.props.loadChildren(id, this.props.user.museumId, currentPage, PER_PAGE);
  }

  render() {
    const {children, selectedNode} = this.props;

    const isSelected = Object.keys({...selectedNode}).length > 0;

    const header =
      <div style={{ width: '500px', paddingBottom: '10px' }}>
        <NodeSuggest
          label="Search"
          id="nodeSearch"
          onChange={ (v) => v ? this.loadNode(v) : null }
          placeHolder={I18n.t('musit.moveModal.nodeSuggestPlaceholder')}
        />
      </div>;

    let body =
      <div style={{ textAlign: 'center', color: 'grey' }}>
        {I18n.t('musit.moveModal.noData')}
      </div>;

    if (children.length > 0) {
      body = (
        <div>
          <ModalNodeGrid
            tableData={children}
            onClick={(n) => this.loadNode(n.id)}
          />
          {this.props.totalNodes && this.props.totalNodes > PER_PAGE &&
          <PagingToolbar
            numItems={this.props.totalNodes}
            currentPage={this.state.currentPage}
            perPage={PER_PAGE}
            onClick={(currentPage) => this.loadNode(selectedNode && selectedNode.id, currentPage)}
          />
          }
        </div>
      );
    }

    const footer =
      <div>
        {I18n.t('musit.moveModal.currentDestination')}
        <Breadcrumb
          node={selectedNode}
          onClickCrumb={(node) => {
            return node.id === -1 || !node.id ? this.loadHome() : this.loadNode(node.id);
          }}
        />
        <div style={{ paddingTop: '10px' }}>
          <SubmitButton
            disabled={!isSelected}
            onClick={() => this.props.onMove(selectedNode, selectedNode.name, this.context.closeModal)}
            label={I18n.t('musit.moveModal.move')}
          />
          &nbsp;
          <CancelButton
            onClick={this.context.closeModal}
            label={I18n.t('musit.texts.close')}
          />
        </div>
      </div>;

    return (
      <Modal
        style={{ minWidth: 700 }}
        header={header}
        body={body}
        footer={footer}
      />
    );
  }
}
