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
      owner: false,
      heartStatus: null,
      heartsCount: null,
      postId: props.match.params.postId,
      post: null
    }

    this._handleDeletePost = this._handleDeletePost.bind(this);
    this._handleHeart = this._handleHeart.bind(this);
  }

  async componentDidMount() {
    const post = await getPost(this.state.postId);
    this.setState({post: post.data()});
    console.log(post.data());
    this.setState({heartsCount: post.data().heartsCount});

    if (post.data().userId === this.props.user.userId) {
      this.setState({owner: true});
    }
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
    const deleteData = await deletePost(this.state.postId, this.state.post.userId, this.props.user.postsCount, this.state.post.tagged, this.state.post.image).then(async () => {
      this.props.fetchUpdatedUser(this.props.user.userId);

      this.props.history.push(`/profile/${this.state.post.userId}`);
    });
  }

  async _handleHeart() {
    if (!this.state.heartStatus) {
      const newHeartsCount = this.state.heartsCount + 1;
      this.setState({heartsCount: newHeartsCount});
      await addHeart(this.props.user.userId, this.props.user.displayName, this.state.postId).then(() => {
      });
    } else {
      const newHeartsCount = this.state.heartsCount - 1;
      this.setState({heartsCount: newHeartsCount});
      await removeHeart(this.props.user.userId, this.props.user.displayName, this.state.postId).then(() => {
      });
    }
    this.setState({heartStatus: !this.state.heartStatus});

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
                <Row>
                  <h2>{this.state.post.title}</h2>
                </Row>
                <Row>
                  <Link to={`/profile/${this.state.post.userId}`} >
                    <h4>{this.state.post.displayName}</h4>
                  </Link>
                </Row>
                <Row>
                  <Card.Text>
                    {this.state.post.desc}
                  </Card.Text>
                </Row>
                <Row>
                  <Card.Text>
                    {this.state.heartsCount} Hearts
                  </Card.Text>
                </Row>
                <Row>
                  <Card.Subtitle className="mb-2 text-muted">
                    {
                      this.state.post.hashtags.map((hashtag) => (
                        <Link to={`/explore/2/${hashtag}`}>
                          #{hashtag}
                        </Link>
                      ))
                    }
                  </Card.Subtitle>
                </Row>
                <Row>
                  <Card.Subtitle className="mb-2 text-muted">
                    {
                      this.state.post.tagged.map((user) => (
                        <Link to={`/profile/${user.userId}`}>
                          @{user.displayName}
                        </Link>
                      ))
                    }
                  </Card.Subtitle>
                </Row>
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
                    <Card.Link href={`${this.state.post.link}`} target="_blank">Link</Card.Link>
                  </Col>
                  {this.state.owner &&
                    <Col>
                      <Card.Link as={Link} to={`/workouts/edit/${this.state.postId}`}>Edit</Card.Link>
                      <Card.Link as={Link} to={'#'} onClick={this._handleDeletePost}>Delete</Card.Link>
                    </Col>
                  }
                </Row>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </div>
    )
  }

}
