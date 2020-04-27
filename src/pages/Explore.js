import React, { Component } from 'react';

export default class Explore extends Component {
  render() {
    return (
      <div>
        <h1>
          Explore
        </h1>
        <SearchBar />
      </div>
    )
  }
}

const SearchBar = () => {
  return (
    <h4>Search</h4>
  )
}
