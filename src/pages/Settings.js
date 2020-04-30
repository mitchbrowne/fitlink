import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import { updateSettings, updateImage } from '../helpers/fireUtils';

import UploadImage from '../components/UploadImage';

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Image,
  Spinner,
} from 'react-bootstrap';

export default (props) => {
  const user = props.user;

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.user === null) return;
    setDisplayName(props.user.displayName);
    setBio(props.user.bio);
    setPhotoURL(props.user.photoURL);
  }, [props])

  const _handleSubmit = async (e) => {
    setError('Updating your settings, one sec...');
    setLoading(true);
    e.preventDefault();
    await updateSettings(user.email, displayName, bio, photoURL).then(() => {
      setError('Changes saved!');
      setLoading(false);
      props.fetchUpdatedUser(user.userId);
    }).catch((error) => {
      setError(error.message);
      setLoading(false);
    })
  }

  const _handleImage = async (imageFile) => {
    console.log(imageFile);
    setLoading(true);
    setError('Uploading Profile Picture, one sec...');
    const imageURL = await updateImage(imageFile, user.userId);
    console.log(imageURL);
    setPhotoURL(imageURL);
    setError('Uploaded! Make sure to save changes...');
    setLoading(false);
  }

  if (user === null) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    )
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
              <Form.Group controlId="bio">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  type="text"
                  value={bio ? bio : ''}
                  onChange={(e) => {setBio(e.target.value)}}
                 />
              </Form.Group>
              <Form.Group controlId="photoURL">
                <Form.Label>Profile Picture</Form.Label>
                <Image src={photoURL} alt="profile picture" className="profile-settings-photo block" roundedCircle/>
                 <UploadImage handleImage={_handleImage}/>
              </Form.Group>
              <div className="text-center">
                {loading
                  ? <Button variant="primary" type="submit" disabled>
                    Save Changes
                  </Button>
                  : <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                }
              </div>

            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
