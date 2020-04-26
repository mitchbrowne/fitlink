import React, { Component, useState, useRef } from 'react';

export default () => {
  const [tags, setTags] = useState([]);
  const tagInputRef = useRef();

  const _handleAddTag = (e) => {
    e.preventDefault();
    const val = e.target.value;
    if (e.key === 'Enter' && val) {
      if (tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      setTags(tags.concat(val));
      tagInputRef.current.value = null;
    } else if (e.key === 'Backspace' && !val) {
      _handleRemoveTag(tags.length - 1);
    }
  }

  const _handleRemoveTag = (i) => {
    const newTags = [...tags];
    newTags.splice(i, 1);
    setTags(newTags);
  }

  return (
    <div className="input-tag">
      <ul className="input-tag__tags">
        {tags.map((tag, i) => (
          <li key={tag}>
            {tag}
            <button type="button" onClick={() => {_handleRemoveTag(i)}}>Remove</button>
          </li>
        ))}


        <li className="input-tag__tags__input">
          <input type="text" onKeyUp={_handleAddTag} ref={tagInputRef}/>
        </li>
      </ul>
    </div>
  )
}
