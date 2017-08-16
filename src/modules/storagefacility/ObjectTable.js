import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Table } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';
import MusitObject from '../../models/object';
import {
  getSampleTypeAndSubType,
  getSampleType,
  getSampleSubType,
  getSampleTypeObj
} from '../sample/shared/types';

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
    const sampleObject = obj => {
      return {
        ...obj,
        uuid: obj.sampleObject.objectId,
        collection: this.props.appSession.collectionId,
        id: obj.sampleObject.objectId,
        museumNo: obj.museumNo,
        objectType: 'sample',
        subNo: obj.subNo,
        term: obj.term,
        sampleNum: obj.sampleObject.sampleNum,
        sampleTypeAndSubType: getSampleTypeAndSubType(
          { sampleTypes: this.props.sampleStore.sampleTypes },
          obj.sampleObject.sampleTypeId,
          this.props.appSession
        ),
        sampleTypeObj: getSampleTypeObj(
          { sampleTypes: this.props.sampleStore.sampleTypes },
          obj.sampleObject.sampleTypeId
        ),
        sampleTypeId: obj.sampleObject.sampleTypeId,
        sampleType: getSampleType(
          { sampleTypes: this.props.sampleStore.sampleTypes },
          obj.sampleObject.sampleTypeId,
          this.props.appSession
        ),
        sampleSubType: getSampleSubType(
          { sampleTypes: this.props.sampleStore.sampleTypes },
          obj.sampleObject.sampleTypeId,
          this.props.appSession
        )
      };
    };
    const showTableData = rowData => {
      const isMainObject = !rowData.mainObjectId || MusitObject.isMainObject(rowData);
      const isChildObject = rowData.mainObjectId && !isMainObject;
      return (
        <tr
          key={rowData.id}
          className={isChildObject ? 'childObject' : isMainObject && 'mainObject'}
          onClick={() => this.props.goToObject(rowData.uuid, rowData.objectType)}
        >
          <td style={{ width: '20px' }}>
            {rowData.objectType && rowData.objectType === 'sample'
              ? <span className="icon icon-musit-testtube" />
              : <span className="icon icon-musitobject" />}
          </td>
          <td>
            {rowData.museumNo}
          </td>
          <td>
            {rowData.subNo}
          </td>
          <td>
            {rowData.term}
          </td>
          <td>
            {rowData.sampleObject && rowData.sampleObject.sampleNum
              ? rowData.sampleObject.sampleNum
              : ''}
          </td>
          <td>
            {rowData.sampleObject &&
              rowData.sampleObject.sampleTypeId &&
              this.props.appSession &&
              this.props.sampleStore.sampleTypes
              ? getSampleTypeAndSubType(
                  { sampleTypes: this.props.sampleStore.sampleTypes },
                  rowData.sampleObject.sampleTypeId,
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
                  this.props.showMoveHistory(rowData);
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
                  this.props.onMove(rowData);
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
                  this.props.pickObject(rowData);
                  e.stopPropagation();
                }}
                title={I18n.t('musit.grid.object.iconTooltip.addToPickList')}
              >
                {this.props.isObjectAdded(rowData)
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
                {this.props.tableData.map(rowData => showTableData(rowData))}
                {this.props.sampleStore.nodeSamples &&
                  this.props.sampleStore.nodeSamples.map(data =>
                    showTableData(sampleObject(data))
                  )}
              </tbody>
            </Table>
          </div>
        </FormGroup>
      </div>
    );
  }
}
