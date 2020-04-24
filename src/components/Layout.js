import React, { Component, useEffect} from 'react';

import Nav from './Nav';

export default (props) => {
  return (
    <div>
      <Nav {...props} user={props.user}/>
      {props.children}
    </div>
  )
}
