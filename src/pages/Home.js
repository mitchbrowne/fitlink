import React, { Component } from 'react';
import SearchBarTagged from '../components/SearchBarTagged';

import {
  Container,
  Row,
  Col
} from 'react-bootstrap';

export default class Home extends Component {
  render() {
    return (
      <div>
        <Container className="justify-content-md-center">
          <h1>Home Page</h1>
          <SearchBarTagged />
        </Container>
      </div>
    )
  }
}
