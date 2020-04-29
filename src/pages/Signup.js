import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {signUp} from '../helpers/fireUtils';

import {
  Container,
  Row,
  Col,
  Form,
  Button
} from 'react-bootstrap'

export default (props) => {
  const [displayName, setDisplayName] = useState('Bridget');
  const [email, setEmail] = useState('bridget@gmail.com');
  const [password, setPassword] = useState('chicken');
  const [confirmPassword, setConfirmPassword] = useState('chicken');
  const [error, setError] = useState('');

  const _handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Password does not match confirmation password.')
    }

    await signUp(email, password, displayName).then(() => {
      console.log('Successfully signed in');
      props.history.push('/');
    }).catch(() => {
      console.log('Unsuccessful sign in');
    })

  }

  return (
    <div>
      <Container>
        <Row className="justify-content-md-center">
          <Col md="2">
            <h1>Sign Up</h1>
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
              <Form.Group controlId="displayName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={displayName}
                  onChange={(e) => {setDisplayName(e.target.value)}}
                 />
              </Form.Group>
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
              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {setConfirmPassword(e.target.value)}}
                 />
              </Form.Group>
              <div className="text-center">
                <Button variant="primary" type="submit">
                  Sign Up
                </Button>
              </div>

            </Form>
            <div className="text-center">
              <Link to="/signin">
              Already have an account?
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
