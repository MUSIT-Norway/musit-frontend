
import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';
import './index.css';

export default class PickListComponent extends Component {
  static propTypes = {
    picks: React.PropTypes.array.isRequired,
    move: React.PropTypes.func.isRequired,
    toggle: React.PropTypes.func.isRequired,
    remove: React.PropTypes.func.isRequired,
    marked: React.PropTypes.array.isRequired,
    iconRendrer: React.PropTypes.func.isRequired,
    labelRendrer: React.PropTypes.func.isRequired,
    isnode: React.PropTypes.bool
  }

  render() {
    const {
      picks,
      marked,
      iconRendrer,
      labelRendrer,
      isnode
    } = this.props;
    const count =
      <span
        className="normalActionNoPadding"
        style={{ fontSize: '0.8em' }}
        title={I18n.t(`musit.pickList.tooltip.${isnode ? 'selectedNodeCount' : 'selectedObjectCount'}`)}
      >
        {`(${marked.length})`}
      </span>;
    return (
      <div>
        <Table responsive striped condensed hover>
          <thead>
            <tr>
              <th style={{ width: '2em', textAlign: 'left' }}>
                <input
                  className="normalAction"
                  type="checkbox"
                  checked={marked.length===picks.length && picks.length !== 0}
                  onChange={(e) => this.props.toggle(picks.map(p => p.value), e.target.checked)}
                  title={I18n.t('musit.pickList.tooltip.checkBoxMarkAll')}
                />
              </th>
              <th style={{ verticalAlign: 'bottom', textAlign: 'left' }}>
                { isnode ?
                  <FontAwesome className="normalActionNoPadding" style={{ fontSize: '1.5em' }} name="print" /> : null
                }
                {isnode ? count : null}
                <FontAwesome
                  className={isnode ? 'normalAction' : 'normalActionNoPadding'}
                  name="truck"
                  style={{ fontSize: '1.5em' }}
                  onClick={() => {
                    if (marked.length > 0) {
                      this.props.move(marked);
                    }
                  }}
                  title={I18n.t(`musit.pickList.tooltip.${isnode ? 'moveSelectedNodes' : 'moveSelectedObjects'}`)}
                />
                {count}
                <FontAwesome
                  className="normalAction"
                  style={{ fontSize: '1.5em' }}
                  name="remove"
                  onClick={() => {
                    if (marked.length > 0) {
                      this.props.remove(marked);
                    }
                  }}
                  title={I18n.t(`musit.pickList.tooltip.${isnode ? 'removeSelectedNodesFromList' : 'removeSelectedObjectsFromList'}`)}
                />
                {count}
              </th>
            </tr>
          </thead>
          <tbody>
            {picks.map((pick, i) => {
              const item = pick.value;
              const isItemMarked = pick.marked;
              const isMainObject = item.isMainObject && item.isMainObject();
              const isChildObject = item.isMainObject && !item.isMainObject();
              return (
                <tr key={i} className={isChildObject ? 'childObject' : isMainObject && 'mainObject' }>
                  <td style={{ width: '3em', textAlign: 'left', verticalAlign: 'middle' }}>
                    <span>
                      {!item.mainObjectId || isMainObject ?
                        <input
                          type="checkbox"
                          checked={isItemMarked ? 'checked' : ''}
                          onClick={() => this.props.toggle(item)}
                        />
                        :
                        <input
                          type="checkbox"
                          checked={isItemMarked ? 'checked' : ''}
                          disabled
                        />
                      }
                    </span>
                  </td>
                  <td>
                    <span className="pickListIcon">
                      {iconRendrer(pick)} {labelRendrer(pick)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }

}
