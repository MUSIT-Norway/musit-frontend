// React
import React, { Component, PropTypes } from 'react';
import { Table, FormGroup } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';

export default class ObjectGrid extends Component {
  static propTypes = {
    tableData: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      museumNo: PropTypes.string.isRequired,
      subNo: PropTypes.string,
      term: PropTypes.string.isRequired
    })).isRequired,
    onAction: PropTypes.func.isRequired,
    showMoveHistory: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired
  }

  render() {
    return (
      <div>
        <FormGroup>
          <div>
            <Table responsive hover condensed>
              <thead>
                <tr>
                  <th style={{width:'20px'}} />
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
                </tr>
              </thead>
              <tbody>
                {this.props.tableData.map((c, i) => {
                  const isMainObject = !c.mainObjectId || c.isMainObject();
                  const isChildObject = c.mainObjectId && !isMainObject;
                  return <tr key={i} className={isChildObject ? 'childObject' : isMainObject && 'mainObject'}>
                    <td style={{width:'20px'}}>
                      <span className="icon icon-musitobject"/>
                    </td>
                    <td>
                      {` ${c.museumNo}`}
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
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.showMoveHistory(c);
                        }}
                        title={I18n.t('musit.grid.object.iconTooltip.moveObjectHistory')}
                      >
                        <span className="icon icon-musitmovehistoryicon"/>
                      </a>
                      }
                    </td>
                    <td>
                      {isMainObject &&
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onMove(c);
                        }}
                        title={I18n.t('musit.grid.object.iconTooltip.moveObject')}
                      >
                        <FontAwesome style={{ fontSize: '1.5em' }} name="truck"/>
                      </a>
                      }
                    </td>
                    <td>
                      {isMainObject &&
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onAction('pickObject', c);
                        }}
                        title={I18n.t('musit.grid.object.iconTooltip.addToPickList')}
                      >
                        <FontAwesome style={{ fontSize: '1.5em' }} name="shopping-cart"/>
                      </a>
                      }
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
