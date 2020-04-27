import React, { Component, useState, useEffect, useRef } from 'react';

import {
  Form,
  InputGroup,
  Button
} from 'react-bootstrap';

export default (props) => {

  const [hashtags, setHashtags] = useState([]);
  const hashtagInputRef = useRef();

  const _handleAddHashtag = (e) => {
    e.preventDefault();
    const val = e.target.value;
    if (e.key === 'Enter' && val) {
      if (hashtags.find(hashtag => hashtag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      props.handleHashtags(hashtags.concat(val))
      setHashtags(hashtags.concat(val));
      hashtagInputRef.current.value = null;
    } else if (e.key === 'Backspace' && !val) {
      _handleRemoveHashtag(hashtags.length - 1);
    }
  }

  const _handleRemoveHashtag = (i) => {
    const newHashtags = [...hashtags];
    newHashtags.splice(i, 1);
    props.handleHashtags(newHashtags)
    setHashtags(newHashtags);
  }

  useEffect(() => {
    if (props.hashtags !== '') {
      console.log(Array.from(props.hashtags));
      let hashtagsData = Array.from(props.hashtags);
      setHashtags(hashtagsData);
    }

  }, [props])


  return (
      <InputGroup>
        <InputGroup.Prepend>
          {hashtags.map((hashtag, i) => (
              <Button key={hashtag} variant="outline-secondary" onClick={() => {_handleRemoveHashtag(i)}}>#{hashtag}</Button>
          ))}
        </InputGroup.Prepend>
        <Form.Control type="text" onKeyUp={_handleAddHashtag} ref={hashtagInputRef}/>
      </InputGroup>
  )
}

{/* <div className="input-tag">
  <ul className="input-tag__tags">
    {hashtags.map((hashtag, i) => (
      <li key={hashtag}>
        #{hashtag}
        <button type="button" onClick={() => {_handleRemoveHashtag(i)}}>Remove</button>
      </li>
    ))}


    <li className="input-tag__tags__input">
      <Form.Control type="text" onKeyUp={_handleAddHashtag} ref={hashtagInputRef}/>
    </li>
  </ul>
</div> */}
