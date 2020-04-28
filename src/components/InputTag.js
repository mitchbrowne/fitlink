import React, { Component, useState, useEffect, useRef } from 'react';
import _ from 'underscore';

import {
  Form,
  InputGroup,
  Button
} from 'react-bootstrap';

export default (props) => {
  const pageLoadTerm = _.sample(['#HIIT', '#20min', '#burn', '#sweat', '#30min', '#outdoor', '#balance']);
  const [placeholder, setPlaceholder] = useState(pageLoadTerm);
  const [hashtags, setHashtags] = useState([]);
  const hashtagInputRef = useRef();

  const _handleAddHashtag = (e) => {
    e.preventDefault();
    let val = e.target.value.trim();
    if (e.key === 'Enter' && val) {
      if (hashtags.find(hashtag => hashtag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      if (val.startsWith('#')) {
        val = val.slice(1);
      }
      props.handleHashtags(hashtags.concat(val))
      setHashtags(hashtags.concat(val));
      hashtagInputRef.current.value = null;
    } else if (e.key === 'Backspace' && !val && (hashtags.length > 0)) {
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
        <Form.Control type="search" placeholder={placeholder} onKeyUp={_handleAddHashtag} ref={hashtagInputRef}/>
      </InputGroup>
  )
}
