import React from 'react'
import FontAwesome from 'react-fontawesome'
let styles = {}
if (process.env.NODE_ENV !== 'test') {
  styles = require('./Breadcrumb.scss')
}

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

  render() {
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
      const breadcrumb = nodes.map((node, index) => {
        let fragment = ''
        let iconFragment = ''
        if (node.type && nodeTypes) {
          const currentType = nodeTypes.find((nodeType) => nodeType.type === node.type)
          if (currentType) {
            iconFragment = (
              <FontAwesome name={currentType.iconName} style={{ padding: '2px' }} />
            )
          }
        }

        if (passive) {
          fragment = (
            <span>
              <span className={styles.crumb}>
              {iconFragment}{node.name}
              </span>
              <span className={styles.crumb}>{divider}</span>
            </span>
          )
        } else if (!isLast(nodeArray, index) || allActive) {
          fragment = (
            <span>
              <span className={styles.crumb}>
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault()
                    onClickCrumb(node, index)
                  }}
                >{iconFragment}{node.name}</a>
              </span>
              <span className={styles.crumb}>{divider}</span>
            </span>
          )
        } else {
          fragment = (<span className={styles.crumb}>{node.name}</span>)
        }
        return fragment
      })
      return breadcrumb
    }
    return (
      <div>
        <span className={styles.crumb}>{divider}</span>{renderCrumb(nodes)}
      </div>
    )
  }
}
