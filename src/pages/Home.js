import React from 'react';
import firebase from 'firebase';
import firestore from '../firestore';

export default (props) => {

  // const db = firebase.firestore();
  // const usersRef = db.collection('users');
  //
  // usersRef.get()
  //         .then(users => {
  //           users.forEach(doc => {
  //             console.log(doc.data().name);
  //           })
  //         })

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
