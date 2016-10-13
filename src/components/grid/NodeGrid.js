
import React, { Component, PropTypes } from 'react'
import { Table, FormGroup } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { I18n } from 'react-i18nify'

export default class NodeGrid extends Component {
  static propTypes = {
    id: PropTypes.number,
    translate: PropTypes.func.isRequired,
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
    refresh: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    rootNode: React.PropTypes.object,
    MusitModal: React.PropTypes.func,
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

  showModal(fromId, name) {
    this.setState({ ...this.state, showModal: true, showModalFromId: fromId, name: name })
  }

  hideModal() {
    this.setState({ ...this.state, showModal: false, showModalFromId: null, name: null })
  }

  moveModal(toId, toName) {
    this.props.onMove(this.state.showModalFromId, toId, {
      onSuccess: () => {
        this.setState({ ...this.state, showModal: false, showModalFromId: null })
        this.props.refresh()
        window.alert(I18n.t('musit.moveModal.messages.nodeMoved', { name: this.state.name, destination: toName }))
      },
      onFailure: () => {
        window.alert(I18n.t('musit.moveModal.messages.errorNode', { name: this.state.name, destination: toName }))
      }
    })
  }

  render() {
    const { id, translate, MusitModal } = this.props
    return (
      <div>
        <MusitModal
          show={this.state.showModal}
          onHide={this.hideModal}
          onMove={this.moveModal}
          headerText={this.props.translate('musit.moveModal.moveNodes')}
        />
        <FormGroup>
          <div>
            <Table responsive hover condensed>
              <thead>
                <tr>
                  <th>
                    {translate('musit.grid.node.nodeName')}
                  </th>
                  <th>
                    {translate('musit.grid.node.nodeType')}
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
                          e.preventDefault()
                          this.props.onClick(c)
                        }}
                      >
                        <FontAwesome name="folder" />
                        {` ${c.name}`}
                      </a>
                    </td>
                    <td id={`${id}_${c.name}_${c.type}_nodeType`}>
                      {translate(`musit.grid.node.nodeTypeItems.${c.type}`)}
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
                          e.preventDefault()
                          this.props.onAction('controlsobservations', c)
                        }}
                      >
                        <span className="icon icon-musitcontrolobsicon" />
                      </a>
                    </td>
                    <td id={`${id}_${c.name}_${c.type}_truck`}>
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault()
                          this.showModal(c.id, c.name)
                        }}
                      >
                        <FontAwesome name="truck" />
                      </a>
                    </td>
                    <td id={`${id}_${c.name}_${c.type}_shoppingCart`}>
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault()
                          this.props.onAction('pickNode', c)
                        }}
                      >
                        <FontAwesome name="shopping-cart" />
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
