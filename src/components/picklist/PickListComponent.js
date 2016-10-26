
import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { I18n } from 'react-i18nify'
import './index.css'

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
    } = this.props

    return (
      <div>
        <Table responsive striped condensed hover>
          <thead>
            <tr>
              <th />
              <th style={{ verticalAlign: "bottom", textAlign: "right" }}>
                {// isnode ?
                 // <FontAwesome className="normalAction" style={{ fontSize: '1.5em' }} name="print" /> : null
                }
                <FontAwesome
                  className="normalAction"
                  name="truck"
                  style={{ fontSize: '1.5em' }}
                  onClick={() => {
                    if (marked.length > 0) {
                      this.props.move(marked)
                    }
                  }}
                  title={I18n.t(`musit.pickList.tooltip.${isnode ? 'moveSelectedNodes' : 'moveSelectedObjects'}`)}
                />
                <FontAwesome
                  className="normalAction"
                  style={{ fontSize: '1.5em' }}
                  name="remove"
                  onClick={() => {
                    if (marked.length > 0) {
                      this.props.remove(marked)
                    }
                  }}
                  title={I18n.t(`musit.pickList.tooltip.${isnode ? 'removeSelectedNodesFromList' : 'removeSelectedObjectsFromList'}`)}
                />
                <span
                  className="normalAction"
                  style={{ fontSize: '1em' }}
                  title={I18n.t(`musit.pickList.tooltip.${isnode ? 'selectedNodeCount' : 'selectedObjectCount'}`)}
                >
                  {`(${marked.length})`}
                </span>
                <span className="normalAction" />
                <input
                  className="normalAction"
                  type="checkbox"
                  checked={marked.length===picks.length && picks.length != 0}
                  onChange={(e) => this.props.toggle(picks.map(p => p.value), e.target.checked)}
                  title={I18n.t('musit.pickList.tooltip.checkBoxMarkAll')}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {picks.map((pick, i) => {
              const item = pick.value
              const isItemMarked = pick.marked
              return (
                <tr key={i}>
                  <td className="pickListIcon">
                    {iconRendrer(pick)} {labelRendrer(pick)}
                  </td>
                  <td style={{ verticalAlign: "bottom", textAlign: "right" }}>
                    <input
                      type="checkbox"
                      style={{ fontSize: '1.5em' }}
                      checked={isItemMarked ? 'checked' : ''}
                      onClick={() => this.props.toggle(item)}
                      className="normalAction"
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    )
  }

}
