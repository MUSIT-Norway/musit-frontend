import React, { PropTypes } from 'react'
import { range } from 'lodash'

const PagingToolbar = (props) => {
  const numPages = props.numItems / props.perPage
  const currentPage = (props.currentPage || 1) * 1
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
        {numPages > 1 && currentPage >= numPages ?
          <a
            href="/page/back"
            onClick={(e) => {
              e.preventDefault()
              props.history.push(`${props.baseUrl}?page=${currentPage-1}`)
            }}
          >
            {'<'}
          </a>
          : '<'
        }
      </span>
      {range(1, numPages + 1).map((n, i) => {
        return (
          <span
            key={i}
            style={{
              padding: '5px'
            }}
          >
            {currentPage === n ?
              n
              :
              <a
                href={`/page/${n}`}
                onClick={(e) => {
                  e.preventDefault()
                  props.history.push(`${props.baseUrl}?page=${n}`)
                }}
              >
                {n}
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
              props.history.push(`${props.baseUrl}?page=${currentPage+1}`)
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

PagingToolbar.propTypes = {
  currentPage: PropTypes.string.isRequired,
  numItems: PropTypes.number.isRequired,
  baseUrl: PropTypes.string.isRequired,
  perPage: PropTypes.number,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
}

PagingToolbar.defaultProps = {
  perPage: 50
}

export default PagingToolbar