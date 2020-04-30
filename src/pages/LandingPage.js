import React, { Component } from 'react';
import LandingPageCarousel from '../components/LandingPageCarousel';

import {
  Container,
  Row,
  Col
} from 'react-bootstrap';

export default class LandingPage extends Component {
  render() {
    return (
      <div>
        <Container className="mt-4 justify-content-md-center">
          <LandingPageCarousel />
        </Container>
      </div>
    )
  }
}
