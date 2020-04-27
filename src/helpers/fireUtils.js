import React from 'react';
import firebase, {FieldValue} from 'firebase';
import firestore from '../firestore';

export const newPost = async (postDetails) => {

  const db = firebase.firestore();

  db.collection('users').doc(postDetails.userId).update({
    postsCount: firebase.firestore.FieldValue.increment(1)
  });

  const postsRef = db.collection('posts')

  // use .add() if no doc exists, and then callback provides the docRef
  return await postsRef.add({
    userId: postDetails.userId,
    displayName: postDetails.displayName,
    title: postDetails.title,
    desc: postDetails.desc,
    image: postDetails.image,
    link: postDetails.link,
    hashtags: postDetails.hashtags,
    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
  }).then((docRef) => {
    console.log('Successful post');

    const userRef = db.collection('users').doc(postDetails.userId).collection('posts');
    userRef.doc(docRef.id).set({
      title: postDetails.title,
      image: postDetails.image,
      hashtags: postDetails.hashtags,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date())
    }).then(() => {

    });
    return docRef;

  }).catch((error) => {
    console.log('Unsuccessful post');
  })

}

export const editPost = async (postDetails) => {

  const db = firebase.firestore();
  const postRef = db.collection('posts').doc(postDetails.postId);

  return await postRef.set({
    title: postDetails.title,
    desc: postDetails.desc,
    image: postDetails.image,
    link: postDetails.link,
    hashtags: postDetails.hashtags,
  }, {merge: true}).then(() => {
    console.log('Successful edit post');

    const userRef = db.collection('users').doc(postDetails.userId).collection('posts').doc(postDetails.postId);
    userRef.set({
      title: postDetails.title,
      image: postDetails.image,
      hashtags: postDetails.hashtags,
    }, {merge: true});

  }).catch((error) => {
    console.log('Unsuccessful edit post');
  })

}

export const deletePost = async (postId, userId, postsCount) => {
  const db = firebase.firestore();

  const userRef = db.collection('users').doc(userId);
  userRef.update({
    postsCount: firebase.firestore.FieldValue.increment(-1)
  });

  const postRef = db.collection('posts').doc(postId);
  return await postRef.delete().then(() => {
    console.log('Successfully deleted post.');


    userRef.collection('posts').doc(postId).delete().then(() => {
      console.log('Successfully removed post from user collection.');

    }).catch((error) => {
      return error.message;
    })

  }).catch((error) => {
    console.log('Error deleting post.');
    return error.message;
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

export const getUsers = async () => {
  const db = firebase.firestore();
  const usersRef = db.collection('users');

  return await usersRef.get().then(users => {
    let allUsers = [];
    users.forEach(doc => {
      allUsers.push(doc);
    })
    return allUsers;
  });
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
  }, {merge: true}).then(function() {
    console.log("Updated Bio and stuff");
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

export const isFollowing = async (userId, userSignedInId) => {
  const db = firebase.firestore();
  const followingRef = db.collection('following').doc(userSignedInId);
  return followingRef.get().then((doc) => {
      if (userId in doc.data()) {
        console.log(userId);
        return true;
      }
      return false;
    });
}

export const addFollowing = async (userId, userSignedInId) => {
  const db = firebase.firestore();

  db.collection('users').doc(userSignedInId).update({
    followingCount: firebase.firestore.FieldValue.increment(1)
  });

  db.collection('users').doc(userId).update({
    followersCount: firebase.firestore.FieldValue.increment(1)
  });

  db.collection('following').doc(userSignedInId).set({
    [userId]: true
  }, {merge: true}).then(function() {
    console.log('Added following');
  });

  db.collection('followers').doc(userId).set({
    [userSignedInId]: true
  }).then(function() {
    console.log('Added to followers');
  });

}

export const removeFollowing = async (userId, userSignedInId) => {
  const db = firebase.firestore();
}
