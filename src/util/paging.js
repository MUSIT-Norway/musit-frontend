import React, { PropTypes } from 'react'
import { range } from 'lodash'

class PagingToolbar extends React.Component {
  render() {
    const numPages = this.props.numItems / this.props.perPage
    const currentPage = this.props.currentPage
    return (
      <div
        style={{
        float: 'right',
        marginRight: '30px'
      }}
      >
      <span
        style={{
          fontWeight: 'bold'
        }}
      >
        {numPages > 1 && currentPage > 1 ?
          <a
            href="/page/back"
            onClick={(e) => {
              e.preventDefault()
              this.props.onClick(currentPage-1)
            }}
          >
            {'<'}
          </a>
          : '<'
        }
      </span>
        {range(1, numPages + 1).map((page, i) => {
          return (
            <span
              key={i}
              style={{
              padding: '5px'
            }}
            >
            {currentPage === page ?
              page
              :
              <a
                href={`/page/${page}`}
                onClick={(e) => {
                  e.preventDefault()
                  this.props.onClick(page)
                }}
              >
                {page}
              </a>
            }
          </span>
          )
        })}
        <span
          style={{
          fontWeight: 'bold'
        }}
        >
        {numPages > 1 && currentPage < numPages ?
          <a
            href="/page/next"
            onClick={(e) => {
              e.preventDefault()
              this.props.onClick(currentPage+1)
            }}
          >
            {'>'}
          </a>
          : '>'
        }
      </span>
      </div>
    )
  }
}

PagingToolbar.propTypes = {
  currentPage: PropTypes.number.isRequired,
  numItems: PropTypes.number.isRequired,
  baseUrl: PropTypes.string.isRequired,
  perPage: PropTypes.number,
  onClick: PropTypes.func.isRequired
}

PagingToolbar.defaultProps = {
  perPage: 50
}

export default PagingToolbar