import React, { useState } from 'react';
import InputTagged from '../components/InputTagged';
import InputTag from '../components/InputTag';
import UploadImage from '../components/UploadImage';
import { newPost, addImage } from '../helpers/fireUtils';

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
  const [hashtags, setHashtags] = useState([]);
  const [tagged, setTagged] = useState([]);
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);

  const _handleSubmit = async (e) => {
    setLoading(true);
    if (title === '' || desc === '' || image === '' || link === '') {
      setError('Please fill out all fields');
      setLoading(false);
      return;
    }
    setError('Uploading your workout, one sec...');
    e.preventDefault();

    let newTagged = [];
    const convertTaggedObjects = () => {
      tagged.map((taggedObject) => {
        const newObject = {userId: taggedObject.value, displayName: taggedObject.label};
        newTagged.push(newObject);
      });
    }

    convertTaggedObjects();

    await addImage(image, props.user.userId, title).then(async (url) => {
      const postDetails = {
        userId: props.user.userId,
        postsCount: props.user.postsCount,
        displayName: props.user.displayName,
        photoURL: props.user.photoURL,
        title: title,
        desc: desc,
        image: url,
        link: link,
        hashtags: hashtags,
        tagged: newTagged
      }
      console.log('Post Details: ', postDetails);
      const docRef = await newPost(postDetails).then((data) => {
        props.fetchUpdatedUser(props.user.userId);
        props.history.push(`/workouts/show/${data.id}`);
        setLoading(false);
      });
    })


  }

  const _handleTagged = (taggedData) => {
    setTagged(taggedData);
  }

  const _handleHashtags = (hashtagsData) => {
    setHashtags(hashtagsData);
  }

  const _handleImage = async (imageFile) => {
    setImage(imageFile);
  }

  return (
    <div>
      <Container className="mt-4">
        <Row className="justify-content-md-center">
          <Col md="4">
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
              <Form.Group controlId="title">
                <Form.Label>What's the workout?</Form.Label>
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
              <Form.Group controlId="image">
                <Form.Label>Add a photo of your workout!</Form.Label>
                <UploadImage handleImage={_handleImage}/>
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
              <Form.Group controlId="tagged">
                <Form.Label>Tag Friends <small>(Must be following to tag friend)</small></Form.Label>
                <InputTagged handleTagged={_handleTagged} tagged={tagged} user={props.user}/>
              </Form.Group>
              <Form.Group controlId="tags">
                <Form.Label>Hashtags <small>(Type tag and hit enter)</small></Form.Label>
                <InputTag handleHashtags={_handleHashtags} hashtags={hashtags}/>
              </Form.Group>
              <div className="text-center">
                {loading
                  ? <Button variant="primary" type="submit" className="mt-4" disabled>
                    Post Workout
                  </Button>
                  : <Button variant="primary" type="submit" className="mt-4" onClick={_handleSubmit}>
                    Post Workout
                  </Button>
                }
              </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
