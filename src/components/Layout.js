import React from 'react';

import Nav from './Nav';

export default (props) => {
  return (
    <div>
      <Nav user={props.user}/>
      {props.children}
    </div>
  )
}
