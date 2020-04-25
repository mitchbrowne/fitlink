import React from 'react';
import firebase from 'firebase';
import firestore from '../firestore';

export default (props) => {
  return (
    <div>
      <h1>Home Page</h1>
      {props.user
        ? <p>Logged in as: {props.user.email}</p>
        : <p></p>
      }
    </div>
  )
}
