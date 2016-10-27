
import React, { Component, PropTypes } from 'react'
import { Table, FormGroup } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { I18n } from 'react-i18nify'
import { emitError, emitSuccess } from '../../errors/emitter'

export default class ObjectGrid extends Component {
  static propTypes = {
    id: PropTypes.number,
    translate: PropTypes.func.isRequired,
    tableData: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      museumNo: PropTypes.string.isRequired,
      subNo: PropTypes.string,
      term: PropTypes.string.isRequired
    })).isRequired,
    onAction: PropTypes.func.isRequired,
    showMoveHistory: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    rootNode: React.PropTypes.object
  }

  constructor(props) {
    super(props)
    this.showModal = this.showModal.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.moveModal = this.moveModal.bind(this)
    this.state = {
      showModal: false
    }
  }

  showModal(fromId, displayName) {
    this.setState({ ...this.state, showModal: true, showModalFromId: fromId, displayName: displayName })
  }

  hideModal() {
    this.setState({ ...this.state, showModal: false, showModalFromId: null, displayName: null })
  }

  moveModal(toId, toName) {
    this.props.onMove(this.state.showModalFromId, toId, {
      onSuccess: () => {
        this.setState({ ...this.state, showModal: false, showModalFromId: null })
        this.props.refresh()
        emitSuccess({ type: 'movedSuccess',
                      message: I18n.t('musit.moveModal.messages.objectMoved', { name: this.state.displayName, destination: toName })})
      },
      onFailure: () => {
        emitError({ type: 'errorDelete',
                    message: I18n.t('musit.moveModal.messages.errorObject', { name: this.state.displayName, destination: toName })})
      }
    })
  }

  render() {
    const { id, translate, tableData, MusitModal, path } = this.props
    return (
      <div>
        <MusitModal
          show={this.state.showModal}
          onHide={this.hideModal}
          onMove={this.moveModal}
          path={path}
          headerText={this.props.translate('musit.moveModal.moveObjects')}
        />
        <FormGroup>
          <div>
            <Table responsive hover condensed>
              <thead>
                <tr>
                  <th>
                    {translate('musit.grid.object.museumsNumber')}
                  </th>
                  <th>
                    {translate('musit.grid.object.uNumber')}
                  </th>
                  <th>
                    {translate('musit.grid.object.term')}
                  </th>
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody>
                {tableData.map((c, i) =>
                  <tr key={i} id={`${id}_${c.museumNo}_${c.subNo}`} >
                    <td id={`${id}_${c.museumNo}_${c.subNo}_museumNumber`}>
                      <FontAwesome name="rebel" />
                      {` ${c.museumNo}`}
                    </td>
                    <td id={`${id}_${c.museumNo}_${c.subNo}_uNumber`}>
                      {c.subNo}
                    </td>
                    <td id={`${id}_${c.museumNo}_${c.subNo}_term`}>
                      {c.term}
                    </td>
                    <td id={`${id}_${c.museumNo}_${c.subNo}_moveHistory`}>
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault()
                          this.props.showMoveHistory(c.id)
                        }}
                        title={I18n.t('musit.grid.object.iconTooltip.moveObjectHistory')}
                      >
                        <span className="icon icon-musitmovehistoryicon" />
                      </a>
                    </td>
                    <td id={`${id}_${c.museumNo}_${c.subNo}_truck`}>
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault()
                          this.showModal(c.id, c.term)
                        }}
                        title={I18n.t('musit.grid.object.iconTooltip.moveObject')}
                      >
                        <FontAwesome style={{ fontSize: '1.5em' }} name="truck" />
                      </a>
                    </td>
                    <td id={`${id}_${c.museumNo}_${c.subNo}_shoppingCart`}>
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault()
                          this.props.onAction('pickObject', c)
                        }}
                        title={I18n.t('musit.grid.object.iconTooltip.addToPickList')}
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
    )
  }
}
