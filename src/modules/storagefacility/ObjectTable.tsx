import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Table } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';
import { flattenSample } from '../sample/shared/types';
import omit from 'lodash/omit';
import TableData from './TableData';

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
    return (
      <div>
        <FormGroup>
          <div>
            <Table responsive hover condensed>
              <thead>
                <tr>
                  <th style={{ width: '20px' }} />
                  <th>{I18n.t('musit.grid.object.museumsNumber')}</th>
                  <th>{I18n.t('musit.grid.object.uNumber')}</th>
                  <th>{I18n.t('musit.grid.object.term')}</th>
                  {this.props.sampleStore.nodeSamples && (
                    <th>{I18n.t('musit.analysis.sampleNumber')}</th>
                  )}
                  {this.props.sampleStore.nodeSamples && (
                    <th>{I18n.t('musit.analysis.sampleType')}</th>
                  )}
                  <th />
                  <th />
                  <th>
                    <a
                      className="onPickObjects"
                      href=""
                      onClick={e => {
                        e.preventDefault();
                        this.props.tableData
                          .concat(this.props.sampleStore.nodeSamples || [])
                          .forEach(data =>
                            this.props.pickObject(
                              data.sampleObject
                                ? flattenSample(
                                    this.props.appSession,
                                    this.props.sampleStore.sampleTypes,
                                    omit(data, 'sampleObject'),
                                    data.sampleObject
                                  )
                                : { ...data, objectData: data }
                            )
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
                {this.props.tableData
                  .concat(this.props.sampleStore.nodeSamples || [])
                  .map((data, i) => (
                    <TableData
                      key={i}
                      rowData={
                        data.sampleObject
                          ? flattenSample(
                              this.props.appSession,
                              this.props.sampleStore.sampleTypes,
                              omit(data, 'sampleObject'),
                              data.sampleObject
                            )
                          : { ...data, objectData: data }
                      }
                      appSession={this.props.appSession}
                      sampleTypes={this.props.sampleStore.sampleTypes}
                      isObjectAdded={this.props.isObjectAdded}
                      pickObject={this.props.pickObject}
                      isMainObject={this.props.isMainObject}
                      onMove={this.props.onMove}
                      showMoveHistory={this.props.showMoveHistory}
                      goToObject={this.props.goToObject}
                      sampleView={!!this.props.sampleStore.nodeSamples}
                    />
                  ))}
              </tbody>
            </Table>
          </div>
        </FormGroup>
      </div>
    );
  }
}
