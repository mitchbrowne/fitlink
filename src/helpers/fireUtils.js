import React from 'react';
import firebase, {FieldValue} from 'firebase';
import firestore from '../firestore';

export const requestUserFeedPosts = async (userSignedInId) => {
  const postsData = await getUserFeedPosts(userSignedInId);

  const compare = (a, b) => {
    if (a.data().createdAt < b.data().createdAt) {
      return 1;
    }
    if (a.data().createdAt > b.data().createdAt) {
      return -1;
    }
    return 0;
  }

  return postsData.flat().sort(compare)
}

export const getUserFeedPosts = async (userSignedInId) => {
  const db = firebase.firestore();
  const userRef = db.collection('following').doc(userSignedInId);
  let followingUsers = [];

  await userRef.get().then((doc) => {
    if (!doc.data()) {
      followingUsers = [];
      return;
    }
    const userIds = doc.data().users.map((user) => {
      followingUsers.push(user.userId);
      return user.userId;
    })
    // followingUsers = Object.keys(doc.data().users);
  });

  followingUsers.push(userSignedInId);

  let followingPosts = [];

  return Promise.all(await followingUsers.map(async userId => {
    let allPosts = [];
    await db.collection('posts').where('userId', '==', userId).get().then(posts => {
      posts.forEach(doc => {
        allPosts.push(doc);
      });
    })
    return allPosts;
  }));
}

export const newPost = async (postDetails) => {

  const db = firebase.firestore();

  db.collection('users').doc(postDetails.userId).update({
    postsCount: firebase.firestore.FieldValue.increment(1)
  });

  const postsRef = db.collection('posts');

  // use .add() if no doc exists, and then callback provides the docRef
  return await postsRef.add({
    userId: postDetails.userId,
    displayName: postDetails.displayName,
    photoURL: postDetails.photoURL,
    title: postDetails.title,
    desc: postDetails.desc,
    image: postDetails.image,
    link: postDetails.link,
    hashtags: postDetails.hashtags,
    tagged: postDetails.tagged,
    heartsCount: 0,
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

    postDetails.tagged.forEach((user) => {
      const userTaggedRef = db.collection('users').doc(user.userId);

      userTaggedRef.update({
        taggedCount: firebase.firestore.FieldValue.increment(1)
      });

      userTaggedRef.collection('taggedPosts').doc(docRef.id).set({
        displayName: postDetails.displayName,
        userId: postDetails.userId,
        title: postDetails.title,
        image: postDetails.image,
        hashtags: postDetails.hashtags,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date())
      }).then(() => {

      });
    })

    const heartRef = db.collection('hearts');
    heartRef.doc(docRef.id).set({
      users: [],
    }).then(() => {
      console.log('Successfull hearting.');
    }).catch((error) => {
      console.log('Unsuccessful hearting');
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

export const deletePost = async (postId, userId, postsCount, tagged) => {
  const db = firebase.firestore();

  const userRef = db.collection('users').doc(userId);
  userRef.update({
    postsCount: firebase.firestore.FieldValue.increment(-1)
  });

  const heartRef = db.collection('hearts').doc(postId).delete();

  const postRef = db.collection('posts').doc(postId);
  return await postRef.delete().then(() => {
    console.log('Successfully deleted post.');


    userRef.collection('posts').doc(postId).delete().then(() => {
      console.log('Successfully removed post from user collection.');
    }).catch((error) => {
      return error.message;
    })

    tagged.forEach((user) => {
      const userTaggedRef = db.collection('users').doc(user.userId);
      userTaggedRef.update({
        taggedCount: firebase.firestore.FieldValue.increment(-1)
      });

      userTaggedRef.collection('taggedPosts').doc(postId).delete().then(() => {
        console.log('Successfully removed post from tagged user collection.');
      });
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

export const queryUsers = async (searchValue) => {
  const db = firebase.firestore();
  const searchValueUpper = searchValue.replace(/^\w/, c => c.toUpperCase());
  const usersRef = db.collection('users').where('displayName', 'in', [searchValue, searchValue.toLowerCase(), searchValue.toUpperCase(), searchValueUpper]);

  return await usersRef.get().then(users => {
    let allUsers = [];
    users.forEach(doc => {
      console.log(doc.data());
      allUsers.push(doc);
    });
    return allUsers;
  }).catch((error) => {
    console.log(error.message);
  });
}

export const queryHashtags = async (hashtagValues) => {
  if (hashtagValues.length === 0) return [];

  const db = firebase.firestore();
  const postsRef = db.collection('posts').where('hashtags', 'array-contains-any', hashtagValues);

  return await postsRef.get().then(posts => {
    let allPosts = [];
    posts.forEach(doc => {
      allPosts.push(doc);
    });
    return allPosts;
  }).catch((error) => {
    console.log(error.message);
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
            followersCount: 0,
            followingCount: 0,
            postsCount: 0,
            taggedCount: 0,
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

export const isHearted = async (userSignedInId, userSignedInDisplayName, postId) => {
  const db = firebase.firestore();
  const heartRef = db.collection('hearts').doc(postId);
  return heartRef.get().then((doc) => {
    console.log(doc.data().users);
    if (!doc.data().users) {
      return false;
    }
    let result = doc.data().users.find(user => user.userId === userSignedInId);
    if (result) {
      console.log(result);
      return true;
    }
    return false;
    });



}

export const addHeart = async (userSignedInId, userSignedInDisplayName, postId) => {
  const db = firebase.firestore();

  db.collection('posts').doc(postId).update({
    heartsCount: firebase.firestore.FieldValue.increment(1)
  });

  db.collection('hearts').doc(postId).update({
    users: firebase.firestore.FieldValue.arrayUnion({
      userId: userSignedInId,
      displayName: userSignedInDisplayName
    })
  }).then(() => {
    console.log('Heart added');
  });
}

export const removeHeart = async (userSignedInId, userSignedInDisplayName, postId) => {
  const db = firebase.firestore();

  db.collection('posts').doc(postId).update({
    heartsCount: firebase.firestore.FieldValue.increment(-1)
  });

  db.collection('hearts').doc(postId).update({
    users: firebase.firestore.FieldValue.arrayRemove({
      userId: userSignedInId,
      displayName: userSignedInDisplayName
    })
  }).then(() => {
    console.log('Heart removed');
  });
}

export const isFollowing = async (userId, userSignedInId) => {
  const db = firebase.firestore();
  const followingRef = db.collection('following').doc(userSignedInId);
  return followingRef.get().then((doc) => {
    if (!doc.data().users) {
      return false;
    }
    let result = doc.data().users.find(user => user.userId === userId);
    if (result) {
      console.log(userId);
      return true;
    }
    return false;
    });

}

export const addFollowing = async (userId, userDisplayName, userPhotoURL, userSignedInId, userSignedInDisplayName, userSignedInPhotoURL) => {
  const db = firebase.firestore();

  db.collection('users').doc(userSignedInId).update({
    followingCount: firebase.firestore.FieldValue.increment(1)
  });

  db.collection('users').doc(userId).update({
    followersCount: firebase.firestore.FieldValue.increment(1)
  });

  db.collection('following').doc(userSignedInId).update({
    users: firebase.firestore.FieldValue.arrayUnion({
      userId: userId,
      displayName: userDisplayName,
      photoURL: userPhotoURL
    })
  }).then(function() {
    console.log('Added following');
  });

  db.collection('followers').doc(userId).set({
    users: firebase.firestore.FieldValue.arrayUnion({
      userId: userSignedInId,
      displayName: userSignedInDisplayName,
      photoURL: userSignedInPhotoURL
    })
  }, {merge: true}).then(function() {
    console.log('Added to followers');
  });

}

export const removeFollowing = async (userId, userDisplayName, userPhotoURL, userSignedInId, userSignedInDisplayName, userSignedInPhotoURL) => {
  const db = firebase.firestore();

  db.collection('users').doc(userSignedInId).update({
    followingCount: firebase.firestore.FieldValue.increment(-1)
  });

  db.collection('users').doc(userId).update({
    followersCount: firebase.firestore.FieldValue.increment(-1)
  });

  db.collection('following').doc(userSignedInId).update({
    users: firebase.firestore.FieldValue.arrayRemove({
      userId: userId,
      displayName: userDisplayName,
      photoURL: userPhotoURL
    })
  }).then(function() {
    console.log('Deleted following');
  });

  db.collection('followers').doc(userId).delete().then(function() {
    console.log('Deleted follower');
  })
}

export const getUsersFollowing = async (userSignedInId) => {
  const db = firebase.firestore();
  const userRef = db.collection('following').doc(userSignedInId);
  let followingUsers = [];

  return await userRef.get().then((doc) => {
    if (!doc.data()) {
      followingUsers = [];
      return;
    }
    const userIds = doc.data().users.map((user) => {
      followingUsers.push(user);
    });
    console.log(followingUsers);
    return followingUsers;
  });
}

export const getUsersFollowingSelect = async (userSignedInId) => {
  const db = firebase.firestore();
  const userRef = db.collection('following').doc(userSignedInId);
  let followingUsers = [];

  return await userRef.get().then((doc) => {
    if (!doc.data()) {
      followingUsers = [];
      return;
    }
    const userIds = doc.data().users.map((user) => {
      let newSelect = {value: user.userId, label: user.displayName}
      followingUsers.push(newSelect);
    });
    console.log(followingUsers);
    return followingUsers;
  });
}

export const getUserTaggedPosts = async (userProfileId) => {
  const db = firebase.firestore();
  const taggedPostsRef = db.collection('users').doc(userProfileId).collection('taggedPosts').orderBy('createdAt', 'desc');

  return await taggedPostsRef.get().then(posts => {
    let taggedPosts = [];
    posts.forEach(doc => {
      console.log(doc.id);
      taggedPosts.push(doc);
    });
    console.log(taggedPosts);
    return taggedPosts;
  });
}

export const getUserFollowers = async (userProfileId) => {
  const db = firebase.firestore();
  const userFollowersRef = db.collection('followers').doc(userProfileId);

  return await userFollowersRef.get().then(followers => {
    console.log(followers.data().users);
    return followers.data().users;
  });
}

export const getUserFollowing = async (userProfileId) => {
  const db = firebase.firestore();
  const userFollowingRef = db.collection('following').doc(userProfileId);

  return await userFollowingRef.get().then(following => {
    console.log(following.data().users);
    return following.data().users;
  });
}
