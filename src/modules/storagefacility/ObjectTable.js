import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Table } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';
import MusitObject from '../../models/object';
import { getSampleTypeAndSubType } from '../sample/shared/types';

export default class ObjectGrid extends Component {
  static propTypes = {
    tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
    pickObject: PropTypes.func.isRequired,
    goToObject: PropTypes.func.isRequired,
    isObjectAdded: PropTypes.func.isRequired,
    showMoveHistory: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    sampleStore: PropTypes.object.isRequired,
    appSession: PropTypes.object.isRequired
  };

  render() {
    const sampleObject = c => {
      return {
        ...c,
        uuid: c.sampleObject.objectId,
        collection: this.props.appSession.collectionId,
        id: c.sampleObject.objectId,
        museumNo: c.museumNo,
        objectType: 'sample',
        subNo: c.subNo,
        term: c.term,
        sampleNum: c.sampleObject.sampleNum,
        sampleTypeAndSubType: getSampleTypeAndSubType(
          { sampleTypes: this.props.sampleStore.sampleTypes },
          c.sampleObject.sampleTypeId,
          this.props.appSession
        )
      };
    };
    const showTableData = c => {
      const isMainObject = !c.mainObjectId || MusitObject.isMainObject(c);
      const isChildObject = c.mainObjectId && !isMainObject;
      return (
        <tr
          key={c.sampleObject ? c.sampleObject.objectId : c.id}
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
            {c.sampleObject && c.sampleObject.sampleNum ? c.sampleObject.sampleNum : ''}
          </td>
          <td>
            {c.sampleObject &&
              c.sampleObject.sampleTypeId &&
              this.props.appSession &&
              this.props.sampleStore.sampleTypes
              ? getSampleTypeAndSubType(
                  { sampleTypes: this.props.sampleStore.sampleTypes },
                  c.sampleObject.sampleTypeId,
                  this.props.appSession
                )
              : ''}
          </td>
          <td>
            {isMainObject &&
              <a
                className="onShowMoveHistory"
                href=""
                onClick={e => {
                  e.preventDefault();
                  this.props.showMoveHistory(c.sampleObject ? sampleObject(c) : c);
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
                  this.props.onMove(c.sampleObject ? sampleObject(c) : c);
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
                  this.props.pickObject(c.sampleObject ? sampleObject(c) : c);
                  e.stopPropagation();
                }}
                title={I18n.t('musit.grid.object.iconTooltip.addToPickList')}
              >
                {this.props.isObjectAdded(c.sampleObject ? sampleObject(c) : c)
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
                  <th>
                    {I18n.t('musit.analysis.sampleNumber')}
                  </th>
                  <th>
                    {I18n.t('musit.analysis.sampleType')}
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
                        this.props.sampleStore.nodeSamples &&
                          this.props.sampleStore.nodeSamples.forEach(o =>
                            this.props.pickObject(sampleObject(o))
                          );
                      }}
                      title={I18n.t('musit.grid.object.iconTooltip.addAllToPickList')}
                    >
                      <FontAwesome style={{ fontSize: '1.5em' }} name="shopping-cart" />
                    </a>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.props.tableData.map((c, i) => showTableData(c, i))}
                {this.props.sampleStore.nodeSamples &&
                  this.props.sampleStore.nodeSamples.map((c, i) =>
                    showTableData({ ...c, objectType: 'sample' })
                  )}
              </tbody>
            </Table>
          </div>
        </FormGroup>
      </div>
    );
  }
}
