import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';

import {
  Container,
  Row,
  Col,
  Form,
  Button
} from 'react-bootstrap'

export default (props) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const _handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Password does not match confirmation password.')
    }
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
      firebase.auth().currentUser.updateProfile({
        displayName: displayName,
        photoURL: `https://api.adorable.io/avatars/290/${email}.png`
      }).then(() => {
        console.log('User added.');
        props.history.push('/');
      }).catch((error) => {
        console.log('User not added.');
        let errorMessage = error.message;
        return setError(errorMessage);
      })
    }).catch(function(error) {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorMessage);
      return setError(errorMessage);
    });
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
