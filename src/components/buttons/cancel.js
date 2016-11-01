import React from 'react'
export default (props) =>
  <button
    className={`btn btn-danger`}
    onClick={props.onClick}
  >
    {props.label}
  </button>