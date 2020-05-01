import React, { Component, useState, useEffect, useRef } from 'react';
import _ from 'underscore';
import Select from 'react-select';
import { getAllUsersSelect } from '../helpers/fireUtils';

import {
  Form,
  InputGroup,
  Button
} from 'react-bootstrap';

export default (props) => {
  const [loaded, setLoaded] = useState(false);
  const [selectedOption, setSelectedOption] = useState();
  const [searchList, setSearchList] = useState([]);
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
    if (props.user !== null && !loaded) {
      getAllUsersSelect().then((data) => {
        console.log(data);
        setSearchList(data);
        setLoaded(true)
      });

    }

  }, [props])

  const handleChange = (selectedOption) => {
    console.log('Handled...');
    setSelectedOption(selectedOption);
    console.log(selectedOption);
    props.handleTagged(selectedOption);
  }

  return (
    <Select
      value={selectedOption}
      options={searchList}
      onChange={handleChange}
      isMulti
      placeholder="Search..."
      openMenuOnClick={false}
     />
  )
}
