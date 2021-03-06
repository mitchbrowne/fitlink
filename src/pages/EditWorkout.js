import React, { useState, useEffect } from 'react';
import InputTag from '../components/InputTag';
import { getPost, editPost } from '../helpers/fireUtils';

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
} from 'react-bootstrap';

export default (props) => {
  const [error, setError] = useState('');
  const [postId, setPostId] = useState(props.match.params.postId);
  const [postDetails, setPostDetails] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [friends, setFriends] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (props.user === null) return;
    const getPostAPI = async () => {
      const postData = await getPost(postId);
      console.log(postData.data());
      let post = postData.data();
      setPostDetails(post);
      setTitle(post.title);
      setDesc(post.desc);
      setLink(post.link);
      setHashtags(post.hashtags);
    }

    getPostAPI();

  }, [props]);

  const _handleSubmit = async (e) => {
    setError('Updating your workout, one sec...');

    e.preventDefault();

    const postDetails = {
      postId: postId,
      userId: props.user.userId,
      title: title,
      desc: desc,
      link: link,
      hashtags: hashtags,
    }
    console.log(postDetails);

    const docRef = await editPost(postDetails);

    props.history.push(`/workouts/show/${postId}`);

  }

  const _handleHashtags = (hashtagsData) => {
    setHashtags(hashtagsData);
    console.log(hashtagsData);
  }

  if (postDetails === null) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    )
  }

  return (
    <div>
      <Container className="mt-4">
        <Row className="mt-4 justify-content-md-center">
          <Col md="4">
            <h1>Edit Workout</h1>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col className="text-center" md="6">
            {error}
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="6">
              <Form.Group controlId="title">
                <Form.Label>Workout Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={title}
                  onChange={(e) => {setTitle(e.target.value)}}
                 />
              </Form.Group>
              <Form.Group controlId="desc">
                <Form.Label>How was it?</Form.Label>
                <Form.Control
                  type="text"
                  value={desc}
                  onChange={(e) => {setDesc(e.target.value)}}
                 />
              </Form.Group>
              <Form.Group controlId="link">
                <Form.Label>Link to Workout Video</Form.Label>
                <Form.Control
                  required
                  type="url"
                  value={link}
                  onChange={(e) => {setLink(e.target.value)}}
                 />
              </Form.Group>
              <Form.Group controlId="tags">
                <Form.Label>Hashtags</Form.Label>
                <small>Type tag and hit enter</small>
                <InputTag hashtags={hashtags} handleHashtags={_handleHashtags}/>
              </Form.Group>
              <div className="text-center">
                <Button variant="primary" type="submit" className="mt-4" onClick={_handleSubmit}>
                  Save Changes
                </Button>
              </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
