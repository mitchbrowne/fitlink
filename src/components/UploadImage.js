import React, { useEffect, useState } from 'react';
import bsCustomFileInput from 'bs-custom-file-input';
import firebase from 'firebase';

import {
  Button,
  Form,
  Image
} from 'react-bootstrap';

export default (props) => {
  bsCustomFileInput.init();
  const [image, setImage] = useState('');
  const [imageURL, setImageURL] = useState('');

  // useEffect(() => {
  //   const storage = firebase.storage();
  //   const pathRef = storage.ref('profileImages/1234_profile_image.jpg');
  //
  //   pathRef.getDownloadURL().then(url => {
  //     setImageURL(url)
  //   });
  // }, [])

  const handleImage = (e) => {
    props.handleImage(e.target.files.item(0));
  }

  // const handleUpload = () => {
  //   const userId = '1234';
  //   const storageRef = firebase.storage().ref();
  //   const profileImageRef = storageRef.child(`profileImages/${userId}_profile_image.jpg`);
  //
  //   const task = profileImageRef.put(image);
  //
  //   task.then((snapshot) => {
  //     const urlRef = snapshot.ref.getDownloadURL();
  //     console.log(urlRef);
  //     urlRef.then(url => {
  //       console.log(url);
  //     })
  //   })
  // }

  // if (imageURL === '') {
  //   return (
  //     <h4>Loading</h4>
  //   )
  // }

  return (
    <div>
      <div className="custom-file">
        <input id="inputGroupFile01" type="file" className="custom-file-input" onChange={handleImage}/>
        <label className="custom-file-label" for="inputGroupFile01">Choose file</label>
      </div>
    </div>
  )
}
