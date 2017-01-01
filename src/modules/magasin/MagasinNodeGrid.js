// React
import React, { Component, PropTypes } from 'react';
import { Table, FormGroup } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';

// Utilities
import MusitNode from '../../models/node';

export default class NodeGrid extends Component {
  static propTypes = {
    tableData: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      objectCount: PropTypes.number,
      totalObjectCount: PropTypes.number,
      nodeCount: PropTypes.number
    })),
    onShowEvents: PropTypes.func.isRequired,
    onPickNode: PropTypes.func.isRequired,
    onMoveNode: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired
  }

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
                  <th />
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.props.tableData.map((c, i) => {
                  const isRoot = MusitNode.isRootNode(c.type);
                  return <tr key={i}>
                    <td>
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onClick(c);
                        }}
                      >
                        <FontAwesome name="folder"/>
                        {` ${c.name}`}
                      </a>
                    </td>
                    <td>
                      {I18n.t(`musit.grid.node.nodeTypeItems.${c.type}`)}
                    </td>
                    <td>
                      {c.objectCount}
                    </td>
                    <td>
                      {c.totalObjectCount}
                    </td>
                    <td>
                      {c.nodeCount}
                    </td>
                    <td>
                      {!isRoot && <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onShowEvents(c);
                        }}
                        title={I18n.t('musit.grid.node.iconTooltip.observationAndControl')}
                      >
                        <span className="icon icon-musitcontrolobsicon"/>
                      </a>}
                    </td>
                    <td>
                      {!isRoot && <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onMoveNode(c);
                        }}
                        title={I18n.t('musit.grid.node.iconTooltip.moveNode')}
                      >
                        <FontAwesome style={{ fontSize: '1.5em' }} name="truck"/>
                      </a>}
                    </td>
                    <td>
                      {!isRoot && <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onPickNode(c);
                        }}
                        title={I18n.t('musit.grid.node.iconTooltip.addToPickList')}
                      >
                        <FontAwesome style={{ fontSize: '1.5em' }} name="shopping-cart"/>
                      </a>}
                    </td>
                  </tr>;
                })}
              </tbody>
            </Table>
          </div>
        </FormGroup>
      </div>
    );
  }
}
