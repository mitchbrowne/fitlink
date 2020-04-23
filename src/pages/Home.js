import React from 'react';
import firebase from 'firebase';
import firestore from '../firestore';

export default () => {

  const db = firebase.firestore();
  const usersRef = db.collection('users');

  usersRef.get()
          .then(users => {
            users.forEach(doc => {
              console.log(doc.data().name);
            })
          })

  return (
    <h1>Home coming soon</h1>
  )
}
