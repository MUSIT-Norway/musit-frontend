import React from 'react'
import FontAwesome from 'react-fontawesome'

export default class Breadcrumb extends React.Component {
  static propTypes = {
    nodes: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      name: React.PropTypes.string.isRequired,
      type: React.PropTypes.string,
      url: React.PropTypes.string
    })),
    nodeTypes: React.PropTypes.arrayOf(React.PropTypes.shape({
      type: React.PropTypes.string.isRequired,
      iconName: React.PropTypes.string.isRequired
    })),
    onClickCrumb: React.PropTypes.func,
    passive: React.PropTypes.bool,
    allActive: React.PropTypes.bool,
    divider: React.PropTypes.string,
  }

  static defaultProps = {
    nodeTypes: [
      { type: 'Top', iconName: 'home' },
      { type: 'Organisation', iconName: 'folder' },
      { type: 'Building', iconName: 'folder' },
      { type: 'Room', iconName: 'folder' },
      { type: 'StorageUnit', iconName: 'folder' }
    ],
    nodes: []
  }

  render() {
    const styles = {
      crumb: { paddingLeft: '0.5em' }
    }
    const {
      nodes,
      nodeTypes,
      onClickCrumb,
      passive, // All nodes are unclickable
      allActive, // All nodes are clickable, also current node
      divider // Fragment splitter
    } = this.props

    const isLast = (array, index) => (array.length - 1) === index
    const renderCrumb = (nodeArray) => {
      return nodeArray.map((node, index) => {
        let fragment = ''
        let iconFragment = ''
        if (node.type && nodeTypes) {
          const currentType = nodeTypes.find((nodeType) => nodeType.type === node.type)
          if (currentType.type !== 'Top') {
            iconFragment = (
              <FontAwesome name={currentType.iconName} style={{ padding: '1px' }} />
            )
          } else {
            iconFragment = (
              <FontAwesome name={currentType.iconName} style={{ 'fontSize': 'x-large', padding: '1px' }} />
            )
          }
        } else {
          iconFragment = (
            <FontAwesome name="folder" style={{ padding: '1px' }} />
          )
        }

        if (passive) {
          fragment = (
            <span key={index}>
              <span style={styles.crumb}>
                {iconFragment}{node.name}
              </span>
              <span style={styles.crumb}>{divider}</span>
            </span>
          )
        } else if (!isLast(nodeArray, index) || allActive) {
          fragment = (
            <span key={index}>
              <span style={styles.crumb}>
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault()
                    onClickCrumb(node, index)
                  }}
                >{iconFragment}{node.name}</a>
              </span>
              <span style={styles.crumb}>{divider}</span>
            </span>
          )
        } else {
          fragment = (<span key={index} style={styles.crumb}>{iconFragment}{node.name}</span>)
        }
        return fragment
      })
    }
    return (
      <div>
        <span style={styles.crumb}>{divider}</span>
        {renderCrumb([{ id: -1, name: '', type: 'Top', url: '/magasin/root' }, ...nodes])}
      </div>
    )
  }
}
