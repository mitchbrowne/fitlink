import React from 'react';
import firebase from 'firebase';
import firestore from '../firestore';

export const postWorkout = async (postDetails) => {

  const db = firebase.firestore();
  const postsRef = db.collection('posts')

  // use .add() if no doc exists, and then callback provides the docRef
  return await postsRef.add({
    userId: postDetails.userId,
    displayName: postDetails.displayName,
    title: postDetails.title,
    desc: postDetails.desc,
    image: postDetails.image,
    link: postDetails.link,
    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
  }).then((docRef) => {
    console.log('Successful post');

    const userRef = db.collection('users').doc(postDetails.userId).collection('posts');
    userRef.doc(docRef.id).set({
      title: postDetails.title,
      image: postDetails.image,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date())
    });
    return docRef;

  }).catch((error) => {
    console.log('Unsuccessful post');
  })

}

export const getPost = async (postId) => {
  const db = firebase.firestore();
  const postRef = db.collection('posts').doc(postId);
  return await postRef.get();
}

export const getUserPosts = async (userId) => {
  const db = firebase.firestore();
  const userPostsRef = db.collection('users').doc(userId).collection('posts').orderBy('createdAt', 'desc');

  return await userPostsRef.get().then(posts => {
    let allPosts = [];
    posts.forEach(doc => {
      console.log(doc.id);
      allPosts.push(doc);
    });
    return allPosts;
  });
}

export const getUser = async (userId) => {
  const db = firebase.firestore();
  const userRef = db.collection('users').doc(userId);

  return await userRef.get();
}

export const updateSettings = async (email, displayName, bio, photoURL) => {
  const user = firebase.auth().currentUser;

  await user.updateProfile({
    displayName: displayName,
    photoURL: photoURL
  }).then(function() {

  }).catch(function(error) {
    return error.message;
  })

  const db = firebase.firestore();
  const userRef = db.collection('users').doc(user.uid);

  await userRef.set({
    email: email,
    displayName: displayName,
    bio: bio,
    photoURL: photoURL
  }).then(function() {
    console.log("Updated Bio and stuff");
  }).catch(function(error) {
    return error.message;
  })
}

// export const getSignedInUser = async () => {
//   const db = firebase.firestore();
//   const usersRef = db.collection('users');
//
//   let user = await firebase.auth().onAuthStateChanged(async (userProfile) => {
//     // let user;
//     if (!userProfile){
//       console.log('No user signed in on state change');
//       return null;
//     }
//     let user = await getUser(userProfile.uid);
//     console.log(user.data());
//     return user;
//   })
// }

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
            bio: '',
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
