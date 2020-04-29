import React, { Component, useEffect } from 'react';
import { Redirect } from 'react-router-dom';


export default (props) => {
  if (props.user !== null) return (
      <div>
        {props.children}
      </div>
    )

  return (
    <div></div>
  )
}
