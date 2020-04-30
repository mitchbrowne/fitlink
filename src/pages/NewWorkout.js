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
  const [title, setTitle] = useState('Testing Times');
  const [desc, setDesc] = useState('Really hard stuff');
  const [image, setImage] = useState('');
  const [hashtags, setHashtags] = useState(['Test it']);
  const [tagged, setTagged] = useState([]);
  const [link, setLink] = useState('https://www.youtube.com/watch?v=yRCUfumiqhk');

  const _handleSubmit = async (e) => {
    if (title === '' || desc === '' || image === '' || link === '') {
      setError('Please fill out all fields');
      return;
    }

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
      });
    })


  }

  const _handleTagged = (taggedData) => {
    setTagged(taggedData);
    console.log(taggedData);
  }

  const _handleHashtags = (hashtagsData) => {
    setHashtags(hashtagsData);
    console.log(hashtagsData);
  }

  const _handleImage = async (imageFile) => {
    setImage(imageFile);
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
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={desc}
                  onChange={(e) => {setDesc(e.target.value)}}
                 />
              </Form.Group>
              <Form.Group controlId="image">
                <Form.Label>Add Image</Form.Label>
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
                <Form.Label>Tag Friends</Form.Label>
                <InputTagged handleTagged={_handleTagged} tagged={tagged} user={props.user}/>
              </Form.Group>
              <Form.Group controlId="tags">
                <Form.Label>Tags</Form.Label>
                <InputTag handleHashtags={_handleHashtags} hashtags={hashtags}/>
              </Form.Group>
              <div className="text-center">
                <Button variant="primary" type="submit" onClick={_handleSubmit}>
                  Post Workout
                </Button>
              </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
