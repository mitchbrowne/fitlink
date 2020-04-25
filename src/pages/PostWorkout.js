import React, { useState } from 'react';
import InputTag from '../components/InputTag';

import {
  Container,
  Row,
  Col,
  Form,
  Button
} from 'react-bootstrap';

export default (props) => {
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [friends, setFriends] = useState('');
  const [link, setLink] = useState('');

  const _handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div>
      <Container>
        <Row className="justify-content-md-center">
          <Col md="2">
            <h1>Post Workout</h1>
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
              <Form.Group controlId="title">
                <Form.Label>Workout Name</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => {setTitle(e.target.value)}}
                 />
              </Form.Group>
              <Form.Group controlId="desc">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={desc}
                  onChange={(e) => {setDesc(e.target.value)}}
                 />
              </Form.Group>
              <Form.Group controlId="image">
                <Form.Label>Add Image</Form.Label>
                <Form.Control
                  type="url"
                  value={image}
                  onChange={(e) => {setImage(e.target.value)}}
                 />
              </Form.Group>
              <Form.Group controlId="link">
                <Form.Label>Link to Workout Video</Form.Label>
                <Form.Control
                  type="url"
                  value={link}
                  onChange={(e) => {setLink(e.target.value)}}
                 />
              </Form.Group>
              <Form.Group controlId="tags">
                <Form.Label>Tags</Form.Label>
                <InputTag />
              </Form.Group>
              <div className="text-center">
                <Button variant="primary" type="submit">
                  Post
                </Button>
              </div>

            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
