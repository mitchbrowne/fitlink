import React, { Component, useState, useEffect, useRef } from 'react';
import _ from 'underscore';
import { getUsersFollowing } from '../helpers/fireUtils';

import {
  Form,
  InputGroup,
  Button
} from 'react-bootstrap';

export default (props) => {
  const [placeholder, setPlaceholder] = useState('@');
  const [tagged, setTagged] = useState([]);
  const taggedInputRef = useRef();

  const _handleAddTagged = (e) => {
    e.preventDefault();
    let val = e.target.value.trim();
    if (e.key === 'Enter' && val) {
      if (tagged.find(tagged => tagged.toLowerCase() === val.toLowerCase())) {
        return;
      }
      if (val.startsWith('@')) {
        val = val.slice(1);
      }
      props.handleTagged(tagged.concat(val))
      setTagged(tagged.concat(val));
      taggedInputRef.current.value = null;
    } else if (e.key === 'Backspace' && !val && (tagged.length > 0)) {
      _handleRemoveTagged(tagged.length - 1);
    }
  }

  const _handleRemoveTagged = (i) => {
    const newTagged = [...tagged];
    newTagged.splice(i, 1);
    props.handleTagged(newTagged)
    setTagged(newTagged);
  }

  useEffect(() => {
    if (props.tagged !== '') {
      console.log(Array.from(props.tagged));
      let taggedData = Array.from(props.tagged);
      setTagged(taggedData);
    }

    if (props.user !== null) {
      getUsersFollowing(props.user.userId).then((data) => {
      });

    }

  }, [props])


  return (
      <InputGroup>
        <InputGroup.Prepend>
          {tagged.map((tagged, i) => (
              <Button key={tagged} variant="outline-secondary" onClick={() => {_handleRemoveTagged(i)}}>@{tagged}</Button>
          ))}
        </InputGroup.Prepend>
        <Form.Control type="search" placeholder={placeholder} onKeyUp={_handleAddTagged} ref={taggedInputRef}/>
      </InputGroup>
  )
}
