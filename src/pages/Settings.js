import React, { useState, useEffect } from 'react';
import firebase from 'firebase';

import {
  Container,
  Row,
  Col,
  Form,
  Button
} from 'react-bootstrap';

export default (props) => {
  const user = props.user;

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (props.user === null) return;
    setDisplayName(props.user.displayName);
    setPhotoURL(props.user.photoURL);
  }, [props])

  const _handleSubmit = (e) => {
    e.preventDefault();

    user.updateProfile({
      displayName: displayName,
      photoURL: photoURL
    }).then(function() {
      // Update successful
      setError('Changes saved!')
      console.log('Profile changes updated successfully.');
      props.fetchUpdatedUser(user)
    }).catch(function(error) {
      // An error happened
      const errorMessage = error.message;
      setError(errorMessage);
      console.log('Profile changes not updated.');
    })
  }

  if (user === null) {
    return (<p>Loading Settings...</p>)
  }

  return (
    <div>
      <Container>
        <Row className="justify-content-md-center">
          <Col md="2">
            <h1>Settings</h1>
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
                  plaintext
                  readOnly
                  defaultValue={user.email}
                 />
              </Form.Group>
              <Form.Group controlId="displayName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={displayName ? displayName : ''}
                  onChange={(e) => {setDisplayName(e.target.value)}}
                 />
              </Form.Group>
              <Form.Group controlId="photoURL">
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control
                  type="url"
                  value={photoURL ? photoURL : ''}
                  onChange={(e) => {setPhotoURL(e.target.value)}}
                 />
              </Form.Group>
              <div className="text-center">
                <Button variant="primary" type="submit">
                  Make Changes
                </Button>
              </div>

            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
