import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Table } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';
import MusitObject from '../../models/object';

export default class ObjectGrid extends Component {
  static propTypes = {
    tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
    pickObject: PropTypes.func.isRequired,
    goToObject: PropTypes.func.isRequired,
    isObjectAdded: PropTypes.func.isRequired,
    showMoveHistory: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    sampleStore: PropTypes.object.isRequired
  };

  render() {
    const showTableData = (c, i) => {
      const isMainObject = !c.mainObjectId || MusitObject.isMainObject(c);
      const isChildObject = c.mainObjectId && !isMainObject;
      return (
        <tr
          key={i}
          className={isChildObject ? 'childObject' : isMainObject && 'mainObject'}
          onClick={() => this.props.goToObject(c.uuid)}
        >
          <td style={{ width: '20px' }}>
            {c.objectType && c.objectType === 'sample'
              ? <FontAwesome style={{ fontSize: '1.3em' }} name="flask" />
              : <span className="icon icon-musitobject" />}
          </td>
          <td>
            {c.museumNo}
          </td>
          <td>
            {c.subNo}
          </td>
          <td>
            {c.term}
          </td>
          <td>
            {isMainObject &&
              <a
                className="onShowMoveHistory"
                href=""
                onClick={e => {
                  e.preventDefault();
                  this.props.showMoveHistory(c);
                  e.stopPropagation();
                }}
                title={I18n.t('musit.grid.object.iconTooltip.moveObjectHistory')}
              >
                <span className="icon icon-musitmovehistoryicon" />
              </a>}
          </td>
          <td>
            {isMainObject &&
              <a
                className="onMoveClick"
                href=""
                onClick={e => {
                  e.preventDefault();
                  this.props.onMove(c);
                  e.stopPropagation();
                }}
                title={I18n.t('musit.grid.object.iconTooltip.moveObject')}
              >
                <FontAwesome style={{ fontSize: '1.5em' }} name="truck" />
              </a>}
          </td>
          <td>
            {isMainObject &&
              <a
                className="onPickObject"
                href=""
                onClick={e => {
                  e.preventDefault();
                  this.props.pickObject(c);
                  e.stopPropagation();
                }}
                title={I18n.t('musit.grid.object.iconTooltip.addToPickList')}
              >
                {this.props.isObjectAdded(c)
                  ? <FontAwesome
                      style={{ fontSize: '1.5em', color: 'Gray' }}
                      name="shopping-cart"
                    />
                  : <FontAwesome style={{ fontSize: '1.5em' }} name="shopping-cart" />}

              </a>}
          </td>
        </tr>
      );
    };
    return (
      <div>
        <FormGroup>
          <div>
            <Table responsive hover condensed>
              <thead>
                <tr>
                  <th style={{ width: '20px' }} />
                  <th>
                    {I18n.t('musit.grid.object.museumsNumber')}
                  </th>
                  <th>
                    {I18n.t('musit.grid.object.uNumber')}
                  </th>
                  <th>
                    {I18n.t('musit.grid.object.term')}
                  </th>
                  <th />
                  <th />
                  <th>
                    <a
                      className="onPickObjects"
                      href=""
                      onClick={e => {
                        e.preventDefault();
                        this.props.tableData.forEach(o => this.props.pickObject(o));
                      }}
                      title={I18n.t('musit.grid.object.iconTooltip.addAllToPickList')}
                    >
                      <FontAwesome style={{ fontSize: '1.5em' }} name="shopping-cart" />
                    </a>
                  </th>
                </tr>
              </thead>
              <tbody>
                {console.log('Rituvesh', this.props.sampleStore)}
                {console.log('Rituvesh', this.props.tableData)}
                {this.props.tableData.map((c, i) => showTableData(c, i))}
                {this.props.sampleStore.nodeSamples &&
                  this.props.sampleStore.nodeSamples.map((c, i) =>
                    showTableData({ ...c, objectType: 'sample' }, i)
                  )}
              </tbody>
            </Table>
          </div>
        </FormGroup>
      </div>
    );
  }
}
