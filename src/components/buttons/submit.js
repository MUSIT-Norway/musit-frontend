import React from 'react'
export default (props) =>
  <button
    disabled={props.disabled ? 'disabled' : ''}
    className={`btn btn-primary`}
    onClick={props.onClick}
  >
    {props.label}
  </button>