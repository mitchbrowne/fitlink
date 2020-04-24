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
  const [displayName, setDisplayName] = useState('Mitch');
  const [email, setEmail] = useState('mfbrowne18@gmail.com');
  const [password, setPassword] = useState('chicken');
  const [confirmPassword, setConfirmPassword] = useState('chicken');
  const [error, setError] = useState('');

  const _handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Password does not match confirmation password.')
    }

    // firebase.auth().createUser({
    //   email: email,
    //   password: password,
    //   displayName: displayName,
    //   photoURL: `https://api.adorable.io/avatars/290/${email}.png`
    // }).then(function(userRecord) {
    //   console.log('Successfully created new user:', userRecord.uid);
    //           props.history.push('/');
    // }).catch(function(error) {
    //   console.log('Error creating new user:', error.message);
    //   return setError(error.message);
    // })

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {

      // props.addUsertoDB(user.uid, email, displayName, `https://api.adorable.io/avatars/290/${email}.png`);
      firebase.auth().currentUser.updateProfile({
        displayName: displayName,
        photoURL: `https://api.adorable.io/avatars/290/${email}.png`
      }).then(() => {

        console.log("user: ", user);
        const db = firebase.firestore();
        const usersRef = db.collection('users');

        usersRef.doc(user.user.uid).set({
          email: user.user.email,
          displayName: user.user.displayName,
          photoURL: `https://api.adorable.io/avatars/290/${user.user.email}.png`
        })

      }).then(() => {
        // console.log('User added.');
        // props.history.push('/');
        // window.location.reload(false);
      }).catch((error) => {
        console.log('User not added.');
        let errorMessage = error.message;
        return setError(errorMessage);
      })


    }).then(() => {
      props.history.push('/');
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
