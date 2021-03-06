import * as React from 'react';
import { PageHeader, Grid, Table } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { I18n } from 'react-i18nify';
import MusitModal from '../movedialog/MoveDialogComponent';
import MusitObject from '../../models/object';
import './PickListComponent.css';
import Config from '../../config';
import PrintTemplate from '../print/PrintTemplateContainer';
import ScannerButton from '../../components/scanner/ScannerButton';
import { TODO } from '../../types/common';
import { AppSession } from '../../types/appSession';
import { History } from 'history';

interface PickListComponentProps {
  pickList: object;
  markNode: Function;
  markObject: Function;
  markMainObject: Function;
  removeNode: Function;
  removeObject: Function;
  appSession: AppSession;
  refreshNode: Function;
  refreshObjects: Function;
  emitError: Function;
  emitSuccess: Function;
  toggleScanner: Function;
  scannerEnabled: boolean;
  moveItems: Function;
  createSample: Function;
  createAnalysis: Function;
  createConservation: Function;

  // TODO:
  //Lagt til Feb 2018 for å få den til å kompile, må sjekke om disse faktisk er riktige/behøves
  isTypeNode: boolean;
  showModal: Function;
  history: History;
  createMultipleSamples: Function;
  type: TODO;
}

/*Old: 
   pickList: PropTypes.object.isRequired,
    markNode: PropTypes.func.isRequired,
    markObject: PropTypes.func.isRequired,
    markMainObject: PropTypes.func.isRequired,
    removeNode: PropTypes.func.isRequired,
    removeObject: PropTypes.func.isRequired,
    appSession: PropTypes.object.isRequired,
    refreshNode: PropTypes.func.isRequired,
    refreshObjects: PropTypes.func.isRequired,
    emitError: PropTypes.func.isRequired,
    emitSuccess: PropTypes.func.isRequired,
    toggleScanner: PropTypes.func.isRequired,
    scannerEnabled: PropTypes.bool.isRequired,
    moveItems: PropTypes.func.isRequired,
    createSample: PropTypes.func.isRequired,
    createAnalysis: PropTypes.func.isRequired,
    createConservation: PropTypes.func.isRequired
 */
export class PickListComponent extends React.Component<PickListComponentProps> {
  constructor(props: PickListComponentProps) {
    super(props);
    this.print = this.print.bind(this);
    this.showMoveNodes = this.showMoveNodes.bind(this);
  }

  showMoveNodes(items: TODO) {
    let title;
    if (this.props.isTypeNode) {
      title = I18n.t('musit.moveModal.moveNodes');
    } else {
      title = I18n.t('musit.moveModal.moveObjects');
    }
    this.props.showModal(
      title,
      <MusitModal
        appSession={this.props.appSession}
        onMove={this.props.moveItems(this.props.appSession, items, this.props.isTypeNode)}
      />
    );
  }

  print(nodesToPrint: TODO) {
    this.props.showModal(
      I18n.t('musit.template.labelTemplates'),
      <PrintTemplate appSession={this.props.appSession} marked={nodesToPrint} />
    );
  }

  toggleObject({ item, on }: TODO) {
    if (item.mainObjectId && MusitObject.isMainObject(item)) {
      this.props.markMainObject({ item, on });
    } else {
      this.props.markObject({ item, on });
    }
  }

  iconRenderer(pick: TODO) {
    if (pick.value.name) {
      return <FontAwesome name="folder" />;
    }
    if (pick.value.objectType === 'sample') {
      return <span className="icon icon-musit-testtube" />;
    }
    return <span className="icon icon-musitobject" />;
  }

  labelRenderer(isNode: boolean, pick: TODO, historyPush: TODO) {
    return (
      <div>
        {!isNode && pick.value.sampleNum ? (
          <span style={{ paddingLeft: '1em' }}>{`${pick.value.sampleNum} ${
            pick.value.sampleTypeAndSubType
          }`}</span>
        ) : null}
        {!isNode ? (
          <span style={{ paddingLeft: '1em' }}>{pick.value.museumNo}</span>
        ) : null}
        {!isNode ? <span style={{ paddingLeft: '1em' }}>{pick.value.subNo}</span> : null}
        <span style={{ paddingLeft: '1em' }}>
          {pick.value.name ? pick.value.name : pick.value.term}
        </span>
        <div className="labelText">
          <Breadcrumb
            node={pick.path}
            onClickCrumb={(node: TODO) => {
              if (node.nodeId) {
                historyPush(
                  Config.magasin.urls.client.storagefacility.goToNode(
                    node.nodeId,
                    this.props.appSession
                  )
                );
              } else {
                historyPush(
                  Config.magasin.urls.client.storagefacility.goToRoot(
                    this.props.appSession
                  )
                );
              }
            }}
            allActive
          />
        </div>
      </div>
    );
  }

  selectedCount(isNode: boolean, count: number) {
    return (
      <span
        className="normalActionNoPadding"
        style={{
          fontSize: '0.8em',
          color: count < 1 ? 'grey' : '#337ab7'
        }}
        title={I18n.t(
          `musit.pickList.tooltip.${isNode ? 'selectedNodeCount' : 'selectedObjectCount'}`
        )}
      >
        {`(${count})`}
      </span>
    );
  }

  remove(item: TODO) {
    if (this.props.isTypeNode) {
      this.props.removeNode(item);
    } else {
      this.props.removeObject(item);
    }
  }
  toggle(item: TODO, on?: TODO) {
    if (this.props.isTypeNode) {
      this.props.markNode({ item, on });
    } else {
      this.toggleObject({ item, on });
    }
  }

  render() {
    const type = this.props.type;
    const pickList = this.props.pickList[type] || [];
    const marked = pickList.filter((p: TODO) => p.marked);
    const markedSamples = marked.filter((p: TODO) => p.value.objectType === 'sample');
    const markedValues = marked.map((p: TODO) => p.value);
    const isNode = this.props.isTypeNode;
    const isObject = !isNode;
    const isMoveAllowed = isObject
      ? marked.length > 0 && this.props.appSession.rolesForModules.storageFacilityWrite
      : isNode
        ? marked.length > 0 && this.props.appSession.rolesForModules.storageFacilityAdmin
        : false;

    const isAllowed =
      marked.length > 0 &&
      this.props.appSession.rolesForModules.collectionManagementWrite;
    // disable for Archaeology & Ethnography collections and for samples
    const conservationEnabled =
      marked.length > 0 &&
      markedSamples.length === 0 &&
      this.props.appSession.rolesForModules.collectionManagementWrite; //&&
    // this.props.appSession.collectionId !== '2e4f2455-1b3b-4a04-80a1-ba92715ff613' &&
    // this.props.appSession.collectionId !== '88b35138-24b5-4e62-bae4-de80fae7df82';
    return (
      <div>
        <main>
          <Grid>
            <PageHeader>
              <div>
                <span>{I18n.t(`musit.pickList.title.${type}`)}</span>
                <div
                  style={{
                    float: 'right',
                    margin: '0 25px 0 0'
                  }}
                >
                  <ScannerButton
                    enabled={this.props.scannerEnabled}
                    onClick={this.props.toggleScanner}
                  />
                </div>
              </div>
            </PageHeader>
            <Table responsive striped condensed hover>
              <thead>
                <tr>
                  <th style={{ width: '2em', textAlign: 'left' }}>
                    <input
                      className="normalAction"
                      type="checkbox"
                      checked={marked.length === pickList.length && pickList.length !== 0}
                      onChange={e =>
                        this.toggle(pickList.map((p: TODO) => p.value), e.target.checked)
                      }
                      title={I18n.t('musit.pickList.tooltip.checkBoxMarkAll')}
                    />
                  </th>
                  <th style={{ verticalAlign: 'bottom', textAlign: 'left' }}>
                    {isNode && (
                      <FontAwesome
                        className="normalActionNoPadding"
                        style={{
                          fontSize: '1.5em',
                          color: marked.length < 1 ? 'grey' : undefined
                        }}
                        name="print"
                        onClick={() => {
                          if (marked.length > 0) {
                            this.print(marked);
                          }
                        }}
                        title={I18n.t('musit.pickList.tooltip.printSelectedNodes')}
                      />
                    )}
                    {isNode && this.selectedCount(isNode, marked.length)}
                    {isObject && (
                      <span
                        className="icon icon-musit-testtube"
                        style={{
                          fontSize: '1.5em',
                          color: isAllowed ? '#337ab7' : 'grey'
                        }}
                        onClick={() => {
                          if (
                            marked.length === 1 &&
                            this.props.appSession.rolesForModules
                              .collectionManagementWrite
                          ) {
                            this.props.createSample(markedValues);
                          } else if (isAllowed) {
                            this.props.createMultipleSamples();
                          }
                        }}
                        title={
                          marked.length < 1 || isAllowed
                            ? I18n.t('musit.analysis.createSample')
                            : I18n.t('musit.pickList.tooltip.doNotHaveSufficientRole')
                        }
                      />
                    )}
                    {isObject && this.selectedCount(isNode, marked.length)}
                    {isObject && (
                      <span>
                        <span
                          className="icon-musit-microscope normalAction"
                          style={{
                            fontSize: '1.5em',
                            color: isAllowed ? '#337ab7' : 'grey'
                          }}
                          onClick={() => {
                            if (isAllowed) {
                              this.props.createAnalysis(
                                markedValues,
                                this.props.appSession
                              );
                            }
                          }}
                          title={
                            marked.length < 1 || isAllowed
                              ? I18n.t('musit.analysis.createAnalysis')
                              : I18n.t('musit.pickList.tooltip.doNotHaveSufficientRole')
                          }
                        />
                        {this.selectedCount(isNode, marked.length)}
                      </span>
                    )}
                    <FontAwesome
                      className="normalAction"
                      name="truck"
                      style={{
                        fontSize: '1.5em',
                        color: isMoveAllowed ? undefined : 'grey'
                      }}
                      onClick={() => {
                        if (isMoveAllowed) {
                          this.showMoveNodes(markedValues);
                        }
                      }}
                      title={
                        marked.length < 1 || isMoveAllowed
                          ? I18n.t(
                              `musit.pickList.tooltip.${
                                isNode ? 'moveSelectedNodes' : 'moveSelectedObjects'
                              }`
                            )
                          : I18n.t('musit.pickList.tooltip.moveNotAllowed')
                      }
                    />
                    {this.selectedCount(isNode, marked.length)}
                    {isObject && (
                      <FontAwesome
                        className="normalAction"
                        style={{
                          fontSize: '1.5em',
                          color: conservationEnabled ? undefined : 'grey'
                        }}
                        name="bank"
                        onClick={() => {
                          if (conservationEnabled) {
                            this.props.createConservation(
                              markedValues,
                              this.props.appSession
                            );
                          }
                        }}
                        title={
                          markedSamples.length === 0
                            ? marked.length < 1 || conservationEnabled
                              ? I18n.t('musit.conservation.createConservation')
                              : I18n.t('musit.pickList.tooltip.doNotHaveSufficientRole')
                            : I18n.t(
                                'musit.conservation.errorMessages.cannotCreateConservationBecauseOfSamples'
                              )
                        }
                      />
                    )}

                    {isObject && this.selectedCount(isNode, marked.length)}
                    <FontAwesome
                      className="normalAction"
                      style={{
                        fontSize: '1.5em',
                        color: marked.length < 1 ? 'grey' : undefined
                      }}
                      name="remove"
                      onClick={() => {
                        if (marked.length > 0) {
                          this.remove(markedValues);
                        }
                      }}
                      title={I18n.t(
                        `musit.pickList.tooltip.${
                          isNode
                            ? 'removeSelectedNodesFromList'
                            : 'removeSelectedObjectsFromList'
                        }`
                      )}
                    />
                    {this.selectedCount(isNode, marked.length)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pickList.map((pick: TODO, i: number) => {
                  const item = pick.value;
                  const isItemMarked = pick.marked;
                  const isMainObject =
                    item.term && (!item.mainObjectId || MusitObject.isMainObject(item));
                  const isChildObject =
                    item.term && (item.mainObjectId && !MusitObject.isMainObject(item));
                  return (
                    <tr
                      key={i}
                      className={
                        isChildObject
                          ? 'childObject'
                          : isMainObject
                            ? 'mainObject'
                            : undefined
                      }
                    >
                      <td
                        style={{
                          width: '3em',
                          textAlign: 'left',
                          verticalAlign: 'middle'
                        }}
                      >
                        <span>
                          {!item.mainObjectId || isMainObject ? (
                            <input
                              type="checkbox"
                              checked={isItemMarked}
                              onChange={() => this.toggle(item)}
                            />
                          ) : (
                            <input type="checkbox" checked={isItemMarked} disabled />
                          )}
                        </span>
                      </td>
                      <td>
                        <span className="pickListIcon">
                          {this.iconRenderer(pick)}{' '}
                          {this.labelRenderer(isNode, pick, this.props.history.push)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <div style={{ textAlign: 'left' }}>
              {marked.length}/{pickList.length} &nbsp;
              {isNode
                ? I18n.t('musit.pickList.footer.nodeSelected')
                : I18n.t('musit.pickList.footer.objectSelected')}
            </div>
          </Grid>
        </main>
      </div>
    );
  }
}
