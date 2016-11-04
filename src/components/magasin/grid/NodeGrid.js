
import React, { Component, PropTypes } from 'react';
import { Table, FormGroup } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';

export default class NodeGrid extends Component {
  static propTypes = {
    id: PropTypes.number,
    tableData: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      objectCount: PropTypes.number,
      totalObjectCount: PropTypes.number,
      nodeCount: PropTypes.number
    })),
    onAction: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired
  }

  render() {
    const { id } = this.props;
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
                {this.props.tableData.map((c, i) =>
                  <tr key={i} id={`${id}_${c.name}_${c.type}`} >
                    <td id={`${id}_${c.name}_${c.type}_nodeName`}>
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onClick(c);
                        }}
                      >
                        <FontAwesome name="folder" />
                        {` ${c.name}`}
                      </a>
                    </td>
                    <td id={`${id}_${c.name}_${c.type}_nodeType`}>
                      {I18n.t(`musit.grid.node.nodeTypeItems.${c.type}`)}
                    </td>
                    <td id={`${id}_${c.name}_${c.type}_objectCount`}>
                      {c.objectCount}
                    </td>
                    <td id={`${id}_${c.name}_${c.type}_totalObjectCount`}>
                      {c.totalObjectCount}
                    </td>
                    <td id={`${id}_${c.name}_${c.type}_nodeCount`}>
                      {c.nodeCount}
                    </td>
                    <td id={`${id}_${c.name}_${c.type}_eye`}>
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onAction('controlsobservations', c);
                        }}
                        title={I18n.t('musit.grid.node.iconTooltip.observationAndControl')}
                      >
                        <span className="icon icon-musitcontrolobsicon" />
                      </a>
                    </td>
                    <td id={`${id}_${c.name}_${c.type}_truck`}>
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onMove(c);
                        }}
                        title={I18n.t('musit.grid.node.iconTooltip.moveNode')}
                      >
                        <FontAwesome style={{ fontSize: '1.5em' }} name="truck" />
                      </a>
                    </td>
                    <td id={`${id}_${c.name}_${c.type}_shoppingCart`}>
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onAction('pickNode', c);
                        }}
                        title={I18n.t('musit.grid.node.iconTooltip.addToPickList')}
                      >
                        <FontAwesome style={{ fontSize: '1.5em' }} name="shopping-cart" />
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </FormGroup>
      </div>
    );
  }
}
