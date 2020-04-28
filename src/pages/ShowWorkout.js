import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { getPost, deletePost, isHearted, addHeart, removeHeart } from '../helpers/fireUtils';
import Timestamp from 'react-timestamp';

import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Spinner,
} from 'react-bootstrap';

export default class ShowWorkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heartStatus: null,
      postId: props.match.params.postId,
      post: null
    }

    this._handleDeletePost = this._handleDeletePost.bind(this);
    this._handleHeart = this._handleHeart.bind(this);
  }

  async componentDidMount() {
    const post = await getPost(this.state.postId);
    this.setState({post: post.data()});
  }

  async componentDidUpdate() {
    if (this.props.user === null) return;

    if (this.state.heartStatus === null) {

      const getHeartStatus = async () => {
        isHearted(this.props.user.userId, this.props.user.displayName, this.state.postId).then((heartStatus) => {
          this.setState({heartStatus: heartStatus});
        });
      }

      getHeartStatus();

    }
  }

  async _handleDeletePost() {
    const sure = window.confirm('Are you sure?');
    if (!sure) return;
    const deleteData = await deletePost(this.state.postId, this.state.post.userId, this.props.user.postsCount).then(async () => {
      this.props.fetchUpdatedUser(this.props.user.userId);

      this.props.history.push(`/profile/${this.state.post.userId}`);
    });
  }

  async _handleHeart() {
    this.setState({heartStatus: !this.state.heartStatus});
    if (!this.state.heartStatus) {
      await addHeart(this.props.user.userId, this.props.user.displayName, this.state.postId).then(() => {
      });
    } else {
      await removeHeart(this.props.user.userId, this.props.user.displayName, this.state.postId).then(() => {
      });
    }

  }

  render() {
    if (this.state.post === null) return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    )

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
                    <Card.Link as={Link} to="#" onClick={this._handleHeart}>{
                      this.state.heartStatus
                      ? ('Unlike')
                      : ('Like')
                    }</Card.Link>
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
