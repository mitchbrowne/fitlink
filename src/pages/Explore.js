import React, { Component } from 'react';

import SearchBar from '../components/SearchBar';

import {
  Container,
} from 'react-bootstrap';

export default class Explore extends Component {
  constructor() {
    super();
    this.state = {
      searchValues: ''
    }

    this._handleSearchSubmit = this._handleSearchSubmit.bind(this);
  }

  _handleSearchSubmit(searchValue) {
    console.log('Searching for ' + searchValue);
  }

  render() {
    return (
      <div>
        <Container>
          <h1>
            Explore
          </h1>
          <SearchBar handleSearchSubmit={this._handleSearchSubmit}/>
        </Container>
      </div>
    )
  }
}
