import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

// export default class Permission extends Component {
//   constructor
//
//   render() {
//     if ()
//   }
// }

export default (props) => {
  if (props.user === null) return (
    <Redirect to="/" />
  )

  return (
    <div>
      {props.children}
    </div>
  )
}
