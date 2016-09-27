import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import ActionListPopupContainer from './ActionListPopupContainer'

export default class PickListComponent extends Component {
  static propTypes = {
    picks: React.PropTypes.array.isRequired,
    move: React.PropTypes.func.isRequired,
    toggle: React.PropTypes.func.isRequired,
    remove: React.PropTypes.func.isRequired,
    marked: React.PropTypes.array.isRequired,
    actions: React.PropTypes.array.isRequired,
    iconRendrer: React.PropTypes.func.isRequired,
    labelRendrer: React.PropTypes.func.isRequired,
    showActionDialog: React.PropTypes.bool.isRequired,
    onCloseActionDialog: React.PropTypes.func.isRequired
  }

  render() {
    const style = require('./index.scss')
    const {
      picks,
      marked,
      iconRendrer,
      labelRendrer,
      actions,
      showActionDialog,
      onCloseActionDialog
    } = this.props

    return (
      <div>
        <ActionListPopupContainer show={showActionDialog} marked={marked} actions={actions} onClose={onCloseActionDialog} />
        <Table responsive striped condensed hover>
          <thead>
            <tr>
              <th className={style.toolsColumn} colSpan="3">
                Alle&nbsp;&nbsp;<input type="checkbox" onChange={(e) => this.props.toggle(picks.map(p => p.value), e.target.checked)} />
                <FontAwesome className={style.normalAction} name="print" />
                <FontAwesome
                  className={style.normalAction}
                  style={{ cursor: 'pointer' }}
                  name="truck"
                  onClick={() => {
                    if (marked.length > 0) {
                      this.props.move(marked)
                    }
                  }}
                />
                <FontAwesome
                  className={style.normalAction}
                  style={{ cursor: 'pointer' }}
                  name="remove"
                  onClick={() => {
                    if (marked.length > 0) {
                      this.props.remove(marked)
                    }
                  }}
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
                  <td className={style.icon}>
                    {iconRendrer(pick)}
                  </td>
                  <td className={style.label}>
                    {labelRendrer(pick)}
                  </td>
                  <td className={style.toolsColumn}>
                    <input
                      type="checkbox"
                      checked={isItemMarked ? 'checked' : ''}
                      onClick={() => this.props.toggle(item)}
                      className={style.normalAction}
                    />
                    <FontAwesome className={style.normalAction} name="print" />
                    <FontAwesome
                      className={style.normalAction}
                      style={{ cursor: 'pointer' }}
                      name="truck"
                      onClick={() => this.props.move(item)}
                    />
                    <FontAwesome
                      className={style.normalAction}
                      style={{ cursor: 'pointer' }}
                      name="remove"
                      onClick={() => this.props.remove(item)}
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
