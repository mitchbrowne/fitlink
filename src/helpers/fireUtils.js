import React from 'react';
import firebase from 'firebase';
import firestore from '../firestore';

export const getUser = async (userId) => {
  const db = firebase.firestore();
  const userRef = db.collection('users').doc(userId);

  return await userRef.get();
}

export const updateSettings = async (user, displayName, photoURL) => {
  await user.updateProfile({
    displayName: displayName,
    photoURL: photoURL
  }).then(function() {

  }).catch(function(error) {
    return error.message;
  })
}

export const signIn = async (email, password) => {
  await firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
    return 'Successfully signed in';
  }).catch(function(error) {
    let errorCode = error.code;
    return error.message;
  });
}

export const signUp = async (email, password, displayName) => {
  await firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {

        firebase.auth().currentUser.updateProfile({
          displayName: displayName,
          photoURL: `https://api.adorable.io/avatars/290/${email}.png`
        }).then(() => {

          console.log("user: ", user);
          const db = firebase.firestore();
          const usersRef = db.collection('users');

          usersRef.doc(user.user.uid).set({
            email: user.user.email,
            displayName: user.user.displayName,
            photoURL: `https://api.adorable.io/avatars/290/${user.user.email}.png`
          })

        }).catch((error) => {
          console.log('User not added.');
          return error.message;
        })


      }).catch(function(error) {
        return error.message;
      });
}
