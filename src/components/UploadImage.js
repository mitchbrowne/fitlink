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

  const handleImage = (e) => {
    props.handleImage(e.target.files.item(0));
  }

  return (
    <div>
      <div className="custom-file">
        <input id="inputGroupFile01" type="file" className="custom-file-input" onChange={handleImage}/>
        <label className="custom-file-label" for="inputGroupFile01">Choose JPEG/JPG</label>
      </div>
    </div>
  )
}
