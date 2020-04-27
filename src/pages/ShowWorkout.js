import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { getPost, deletePost } from '../helpers/fireUtils';
import Timestamp from 'react-timestamp';

import {
  Container,
  Row,
  Col,
  Card,
  Image,
} from 'react-bootstrap';

export default class ShowWorkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: props.match.params.postId,
      post: null
    }

    this._handleDeletePost = this._handleDeletePost.bind(this);
  }

  async componentDidMount() {
    const post = await getPost(this.state.postId);
    console.log(post.data());
    this.setState({post: post.data()});
  }

  async _handleDeletePost() {
    const sure = window.confirm('Are you sure?');
    if (!sure) return;
    console.log('First Count: ', this.props.user.postsCount);
    const deleteData = await deletePost(this.state.postId, this.state.post.userId, this.props.user.postsCount).then(async () => {
      console.log(this.props.user.postsCount);
      this.props.fetchUpdatedUser(this.props.user.userId);

      this.props.history.push(`/profile/${this.state.post.userId}`);
    });
  }

  render() {
    if (this.state.post === null) return (<p>Loading Workout...</p>)
    return (
      <div>
        <Container>
          <Row md="8" className="justify-content-md-center">
            <Card>
              <Card.Img variant="top" src={this.state.post.image} alt={`${this.state.post.title} workout image`} className='workout-post-image' />
              <Card.Body>
                <h2>{this.state.post.title}</h2>
                <Link to={`/profile/${this.state.post.userId}`} >
                  <h4>{this.state.post.displayName}</h4>
                </Link>
                <Card.Text>
                  {this.state.post.desc}
                </Card.Text>
                <Row>
                  <Col>
                    <Timestamp date={this.state.post.createdAt.toDate()} />
                  </Col>
                  <Col>
                    <Card.Link as={Link} to="#">Like</Card.Link>
                    <Card.Link as={Link} to="#">Comment</Card.Link>
                    <Card.Link href={`${this.state.post.link}`} target="_blank">Link</Card.Link>
                  </Col>
                  <Col>
                    <Card.Link as={Link} to={`/workouts/edit/${this.state.postId}`}>Edit</Card.Link>
                    <Card.Link as={Link} to={'#'} onClick={this._handleDeletePost}>Delete</Card.Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </div>
    )
  }

}
