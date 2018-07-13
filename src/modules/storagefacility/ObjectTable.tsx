import * as React from "react";
import { Component } from "react";
import { FormGroup, Table } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';
import { flattenSample } from '../sample/shared/types';
import {omit} from 'lodash';
import TableData, { Data } from './TableData';
import { AppSession } from "../../types/appSession";
import { SampleStore } from "../../types/storage";
import { TODO } from "../../types/common";

interface ObjectGridProps {
  tableData: Array<object>;
  pickObject: (data: Data) => void;
  goToObject: (id: string, type: string) => void;
  isObjectAdded: (data: Data) => boolean;
  showMoveHistory: (data: Data) => void;
  onMove: (data: Data) => void;
  sampleStore: SampleStore;
  appSession: AppSession;

  isMainObject?: boolean;
}

/* Old:
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

*/

export default class ObjectGrid extends Component<ObjectGridProps> {
  
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
                          .forEach((data:TODO) =>
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
                  .map((data:TODO, i:number) => (
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
                      //Removed/redundant now? isMainObject={this.props.isMainObject}
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
