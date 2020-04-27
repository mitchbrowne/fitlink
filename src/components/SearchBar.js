import React, { useState } from 'react';
import _ from 'underscore';

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ButtonGroup,
  ToggleButtonGroup,
  ToggleButton,
} from 'react-bootstrap';

export default (props) => {
  const pageLoadTerm = _.sample(['#HIIT', '#20min', '#burn', '#sweat', '#30min', '#outdoor', '#balance']);
  const [placeholder, setPlaceholder] = useState(pageLoadTerm);
  const [searchValue, setSearchValue] = useState('');

  const _handleToggle = (e) => {
    const val = e.target.value;
    console.log(typeof val);
    console.log('toggled');
    let term = '';
    if (val === '1') {
      setPlaceholder('')
    } else if (val === '2') {
      term = _.sample(['#HIIT', '#20min', '#burn', '#sweat', '#30min', '#outdoor', '#balance']);
      setPlaceholder(term);
    } else if (val === '3') {
      term = _.sample(['Cardio', 'Yoga', 'HITT', 'Free Weights', 'Strength', 'Power', 'Upper Body', 'Lower Body', 'Full Body', 'Pilates', 'Spin', 'Partner', 'Group', 'Outdoors']);
      setPlaceholder(term)
    } else if (val === '4') {
      term = _.sample(['@Mitch', '@Liv', '@Kristen', '@Oscar']);
      setPlaceholder(term);
    }
  }

  const _handleSubmit = (e) => {
    e.preventDefault();
    console.log(searchValue);
    props.handleSearchSubmit(searchValue);
  }

  return (
    <Container>
      <Form onSubmit={_handleSubmit}>
        <Row className="justify-content-md-center">
          <Col md="6">
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={2}>
                  Search
                </Form.Label>
                <Col>
                  <Form.Control type="text" placeholder={placeholder} onChange={(e) => {setSearchValue(e.target.value)}}/>
                </Col>
              </Form.Row>
            </Form.Group>
          </Col>
          <Col md="0">
            <Button variant="primary" type="submit">
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      <Row className="justify-content-md-center">
        <Col md="4">
          <ToggleButtonGroup type="radio" name="options" defaultValue={1} aria-label="Buttons for search">
            <ToggleButton value={1} onClick={_handleToggle} variant="outline-secondary">Top</ToggleButton>
            <ToggleButton value={2} onClick={_handleToggle} variant="outline-secondary">Tags</ToggleButton>
            <ToggleButton value={3} onClick={_handleToggle} variant="outline-secondary">Categories</ToggleButton>
            <ToggleButton value={4} onClick={_handleToggle} variant="outline-secondary">Accounts</ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>
    </Container>
  )
}
