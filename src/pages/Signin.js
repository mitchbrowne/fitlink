import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signIn } from '../helpers/fireUtils';

import {
  Container,
  Row,
  Col,
  Form,
  Button
} from 'react-bootstrap'

export default (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const _handleSubmit = async (e) => {
    e.preventDefault();

    await signIn(email, password).then(() => {
      props.history.push('/home')
    }).catch((error) => {
      setError(error.message);
    });
  }

  return (
    <div>
      <Container>
        <Row className="justify-content-md-center">
          <Col md="2">
            <h1>Sign In</h1>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col className="text-center" md="6">
            {error}
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="6">
            <Form onSubmit={_handleSubmit}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => {setEmail(e.target.value)}}
                 />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => {setPassword(e.target.value)}}
                 />
              </Form.Group>
              <div className="text-center">
                <Button variant="primary" type="submit">
                  Sign In
                </Button>
              </div>
            </Form>
            <div className="text-center">
              <Link to="/signup">
                Not already signed up?
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
