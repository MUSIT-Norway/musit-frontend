import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, FormGroup } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';
import MusitNode from '../../models/node';

export default class NodeGrid extends Component {
  static propTypes = {
    tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
    goToEvents: PropTypes.func.isRequired,
    pickNode: PropTypes.func.isRequired,
    isNodeAdded: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired
  };

  render() {
    return (
      <div>
        <FormGroup>
          <div>
            <Table responsive hover condensed>
              <thead>
                <tr>
                  <th>
                    {I18n.t('musit.grid.node.nodeName')}
                  </th>
                  <th>
                    {I18n.t('musit.grid.node.nodeType')}
                  </th>
                  <th />
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.props.tableData.map((c, i) => {
                  const isRoot = MusitNode.isRootNode(c);
                  return (
                    <tr key={i}>
                      <td>
                        <a
                          className="onClickName"
                          href=""
                          onClick={e => {
                            e.preventDefault();
                            this.props.onClick(c);
                          }}
                        >
                          <FontAwesome name="folder" />
                          {` ${c.name}`}
                        </a>
                      </td>
                      <td>
                        {I18n.t(`musit.grid.node.nodeTypeItems.${c.type}`)}
                      </td>
                      <td>
                        {!isRoot &&
                          <a
                            className="goToEventClick"
                            href=""
                            onClick={e => {
                              e.preventDefault();
                              this.props.goToEvents(c);
                            }}
                            title={I18n.t(
                              'musit.grid.node.iconTooltip.observationAndControl'
                            )}
                          >
                            <span className="icon icon-musitcontrolobsicon" />
                          </a>}
                      </td>
                      <td>
                        {!isRoot &&
                          <a
                            className="onMoveClick"
                            href=""
                            onClick={e => {
                              e.preventDefault();
                              this.props.onMove(c);
                            }}
                            title={I18n.t('musit.grid.node.iconTooltip.moveNode')}
                          >
                            <FontAwesome style={{ fontSize: '1.5em' }} name="truck" />
                          </a>}
                      </td>
                      <td>
                        {!isRoot &&
                          <a
                            className="onPickClick"
                            href=""
                            onClick={e => {
                              e.preventDefault();
                              this.props.pickNode(c);
                            }}
                            title={I18n.t('musit.grid.node.iconTooltip.addToPickList')}
                          >
                            {c && this.props.isNodeAdded(c)
                              ? <FontAwesome
                                  style={{ fontSize: '1.5em', color: 'Gray' }}
                                  name="shopping-cart"
                                />
                              : <FontAwesome
                                  style={{ fontSize: '1.5em' }}
                                  name="shopping-cart"
                                />}

                          </a>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </FormGroup>
      </div>
    );
  }
}
