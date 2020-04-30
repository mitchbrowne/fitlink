import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { getPost, deletePost, isHearted, addHeart, removeHeart } from '../helpers/fireUtils';
import moment from 'moment';
// import svg from 'bootstrap-icons';

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
      post: null,
      linked: true,
    }

    this._handleDeletePost = this._handleDeletePost.bind(this);
    this._handleHeart = this._handleHeart.bind(this);
    this._handleLinkClick = this._handleLinkClick.bind(this);
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

  _handleLinkClick() {
    this.setState({linked: !this.state.linked});
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
          <Row className="d-flex justify-content-center mt-4">
              <Card className="w-75 mb-4">
                <Card.Img variant="top" src={this.state.post.image} alt={`${this.state.post.title} workout image`} className='workout-post-image' />
                <Card.Body>
                  <Row className="mb-2">
                    <Col xs lg="10">
                      <h2>{this.state.post.title}</h2>
                    </Col>
                    <Col xs="12" lg="2">
                      <Image src={this.state.post.photoURL} className="navbar-photoURL mr-2" roundedCircle />
                      <Card.Link className="main-custom-link" as={Link} to={`/profile/${this.state.post.userId}`} >{this.state.post.displayName}</Card.Link>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Card.Subtitle className="mb-2 text-muted">
                        {
                          this.state.post.hashtags.map((hashtag) => (
                            <Link className="main-custom-link" to={`/explore/2/${hashtag}`}>
                              #{hashtag}&ensp;
                            </Link>
                          ))
                        }
                      </Card.Subtitle>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col>
                      <Card.Text>
                        {this.state.post.desc}
                      </Card.Text>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col>
                      <Card.Subtitle className="mb-2 text-muted">
                        {
                          this.state.post.tagged.map((user) => (
                            <Link className="main-custom-link" to={`/profile/${user.userId}`}>
                              @{user.displayName}
                            </Link>
                          ))
                        }
                      </Card.Subtitle>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs lg="9">
                      <small className="align-bottom">{moment(this.state.post.createdAt.toDate()).format('LLLL')}</small>
                    </Col>
                    <Col xs="12" lg="3">
                      <div className="heart-count mr-4">
                        {this.state.heartsCount}
                      </div>
                        <div className="heart-icon mr-4" onClick={this._handleHeart}>
                          {
                            this.state.heartStatus
                            ? <svg class="bi bi-heart-fill" width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" clip-rule="evenodd"/>
                              </svg>
                            : <svg class="bi bi-heart" width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 01.176-.17C12.72-3.042 23.333 4.867 8 15z" clip-rule="evenodd"/>
                              </svg>
                          }
                        </div>
                        <div className="heart-icon" onClick={this._handleLinkClick}>
                          {
                            this.state.linked
                            ? <Card.Link className="heart-icon" href={`${this.state.post.link}`} target="_blank">
                              <svg class="bi bi-link" width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.354 5.5H4a3 3 0 000 6h3a3 3 0 002.83-4H9c-.086 0-.17.01-.25.031A2 2 0 017 10.5H4a2 2 0 110-4h1.535c.218-.376.495-.714.82-1z"/>
                                <path d="M6.764 6.5H7c.364 0 .706.097 1 .268A1.99 1.99 0 019 6.5h.236A3.004 3.004 0 008 5.67a3 3 0 00-1.236.83z"/>
                                <path d="M9 5.5a3 3 0 00-2.83 4h1.098A2 2 0 019 6.5h3a2 2 0 110 4h-1.535a4.02 4.02 0 01-.82 1H12a3 3 0 100-6H9z"/>
                                <path d="M8 11.33a3.01 3.01 0 001.236-.83H9a1.99 1.99 0 01-1-.268 1.99 1.99 0 01-1 .268h-.236c.332.371.756.66 1.236.83z"/>
                              </svg>
                            </Card.Link>
                            : <Card.Link className="heart-icon" href={`${this.state.post.link}`} target="_blank">
                              <svg class="bi bi-link-45deg" width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.715 6.542L3.343 7.914a3 3 0 104.243 4.243l1.828-1.829A3 3 0 008.586 5.5L8 6.086a1.001 1.001 0 00-.154.199 2 2 0 01.861 3.337L6.88 11.45a2 2 0 11-2.83-2.83l.793-.792a4.018 4.018 0 01-.128-1.287z"/>
                                <path d="M5.712 6.96l.167-.167a1.99 1.99 0 01.896-.518 1.99 1.99 0 01.518-.896l.167-.167A3.004 3.004 0 006 5.499c-.22.46-.316.963-.288 1.46z"/>
                                <path d="M6.586 4.672A3 3 0 007.414 9.5l.775-.776a2 2 0 01-.896-3.346L9.12 3.55a2 2 0 012.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 00-4.243-4.243L6.586 4.672z"/>
                                <path d="M10 9.5a2.99 2.99 0 00.288-1.46l-.167.167a1.99 1.99 0 01-.896.518 1.99 1.99 0 01-.518.896l-.167.167A3.004 3.004 0 0010 9.501z"/>
                              </svg>
                            </Card.Link>
                          }
                        </div>
                    </Col>

                  </Row>
                </Card.Body>
                {this.state.owner &&
                  <Card.Footer>
                    <Col xs={12} lg="12">
                      <Card.Link className="main-custom-link" as={Link} to={`/workouts/edit/${this.state.postId}`}>Edit</Card.Link>
                      <Card.Link className="main-custom-link" as={Link} to={'#'} onClick={this._handleDeletePost}>Delete</Card.Link>
                    </Col>
                  </Card.Footer>
                }
              </Card>
          </Row>
        </Container>
      </div>
    )
  }

}
