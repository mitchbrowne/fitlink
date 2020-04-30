import React, { Component, useRef } from 'react';
import { Link } from 'react-router-dom';
import { requestUserFeedPosts, getUserFeedPosts, isHearted, addHeart, removeHeart } from '../helpers/fireUtils';
import moment from 'moment';

import {
  Container,
  Row,
  Col,
  Card,
  CardGroup,
  Image,
  Spinner,
} from 'react-bootstrap';

export default class UserFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      posts: null,
      postsHeartStatus: null,
      postsHeartCount: null
    }

    this._handleHeartClick = this._handleHeartClick.bind(this);
  }

  async componentDidMount() {
    console.log("Mounting.......");
    if (this.props.user) {
      this.setState({user: this.props.user});
    }

    if (this.props.user !== null) {
      const getPostsData = async () => {
        const postsData = await requestUserFeedPosts(this.props.user.userId);
        this.setState({posts: postsData.flat()});

        let newPostsHeartCount = {};
        let newPostsHeartStatus = {};

        if (postsData.flat().length === 0) {
          this.setState({postsHeartCount: newPostsHeartCount});
          this.setState({postsHeartStatus: newPostsHeartStatus});
        }

        const allPosts = postsData.flat().map((post) => {
          const postHeartCount = {
            [post.id]: post.data().heartsCount
          }
          newPostsHeartCount = Object.assign({}, postHeartCount, newPostsHeartCount);
          this.setState({postsHeartCount: newPostsHeartCount});

          const getHeartStatus = () => {
            isHearted(this.props.user.userId, this.props.user.displayName, post.id).then((heartStatus) => {
              const postHeartStatus = {
                [post.id]: heartStatus
              }
              newPostsHeartStatus = Object.assign({}, postHeartStatus, newPostsHeartStatus);
              this.setState({postsHeartStatus: newPostsHeartStatus});
            });
          }
          getHeartStatus();
        });
      }
      getPostsData();
    }
  }

  async componentDidUpdate() {
    if (this.state.user === null) {
      this.setState({user: this.props.user});

      const getPostsData = async () => {
        const postsData = await requestUserFeedPosts(this.props.user.userId);
        this.setState({posts: postsData.flat()});

        let newPostsHeartCount = {};
        let newPostsHeartStatus = {};

        if (postsData.flat().length === 0) {
          this.setState({postsHeartCount: newPostsHeartCount});
          this.setState({postsHeartStatus: newPostsHeartStatus});
        }

        const allPosts = postsData.flat().map((post) => {
          const postHeartCount = {
            [post.id]: post.data().heartsCount
          }
          newPostsHeartCount = Object.assign({}, postHeartCount, newPostsHeartCount);
          this.setState({postsHeartCount: newPostsHeartCount});

          const getHeartStatus = () => {
            isHearted(this.props.user.userId, this.props.user.displayName, post.id).then((heartStatus) => {
              const postHeartStatus = {
                [post.id]: heartStatus
              }
              newPostsHeartStatus = Object.assign({}, postHeartStatus, newPostsHeartStatus);
              this.setState({postsHeartStatus: newPostsHeartStatus});
            });
          }
          getHeartStatus();
        });
      }
      getPostsData();
    }
  }

  async _handleHeartClick(postId, heartStatus) {
    const postHeartStatus = {
      [postId]: !heartStatus
    }
    const newPostsHeartStatus = Object.assign({}, this.state.postsHeartStatus, postHeartStatus);
    this.setState({postsHeartStatus: newPostsHeartStatus});

    let newHeartCount;

    if (!heartStatus) {
      newHeartCount = {[postId]: this.state.postsHeartCount[postId] + 1};
      await addHeart(this.props.user.userId, this.props.user.displayName, postId).then(() => {
      });
    } else {
      newHeartCount = {[postId]: this.state.postsHeartCount[postId] - 1};
      await removeHeart(this.props.user.userId, this.props.user.displayName, postId).then(() => {
      });
    }

    const newPostsHeartCount = Object.assign({}, this.state.postsHeartCount, newHeartCount)
    this.setState({postsHeartCount: newPostsHeartCount});

  }

  render() {

    if (this.state.user === null || this.state.posts === null || this.state.postsHeartStatus === null) return (
      <div className='loading-spinner-container'>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    )

    if (this.state.user === null || this.state.posts.length === 0) return (
      <Container className="justify-content-md-center">
        <Row className="margin-top-profile justify-content-md-center">
        <h4>You have no posts... Maybe follow some <Link className="main-custom-link" as={Link} to={`/explore`}>friends?</Link></h4>
        </Row>
      </Container>
    )

    return (
      <div>
        <Container className="justify-content-md-center">
          <UserFeedPosts
            posts={this.state.posts}
            postsHeartStatus={this.state.postsHeartStatus}
            postsHeartCount={this.state.postsHeartCount}
            handleHeartClick={this._handleHeartClick}
          />
        </Container>
      </div>
    )
  }
}

const UserFeedPosts = (props) => {

  const _handleHeartClick = (e, heartStatus) => {
    props.handleHeartClick(e.target.id, heartStatus);
  }

  const allPosts = props.posts.map((post) => {
    const p = post.data();
    const pId = post.id;
    return (
        <Row key={pId} className="d-flex justify-content-center  mt-4">
          <CardGroup>
            <Card className="w-75 mb-4">
              <Card.Img variant="top" src={p.image} alt={`${p.title} post image`} />
            </Card>
            <Card className="w-75 mb-4">
              <Card.Body>
                <Row>
                  <Col xs={12} lg="9">
                    <Link className="main-custom-link" to={`/workouts/show/${pId}`}>
                      <h1>{p.title}</h1>
                    </Link>
                  </Col>
                  <Col xs="12" lg="3">
                    <Image src={p.photoURL} className="navbar-photoURL mr-2" roundedCircle />
                    <Card.Link className="main-custom-link" as={Link} to={`/profile/${p.userId}`}>
                      {p.displayName}
                    </Card.Link>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Card.Text className="mb-4">{p.desc}</Card.Text>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <Card.Subtitle className="mb-2 text-muted">
                      {
                        p.hashtags.map((hashtag) => (
                          <Link className="main-custom-link" to={`/explore/2/${hashtag}`}>
                            #{hashtag}&ensp;
                          </Link>
                        ))
                      }
                    </Card.Subtitle>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Card.Subtitle className="mb-2 text-muted">
                      {
                        p.tagged.map((user) => (
                          <Link className="main-custom-link" to={`/profile/${user.userId}`}>
                            @{user.displayName}&ensp;
                          </Link>
                        ))
                      }
                    </Card.Subtitle>
                  </Col>
                </Row>
                <Row className="align-baseline">
                  <Col>
                    <div className="heart-count mr-4">
                      {props.postsHeartCount[pId]}
                    </div>
                      <div className="heart-icon mr-4" id={pId} onClick={(e) => {_handleHeartClick(e, props.postsHeartStatus[pId])}}>
                        <div>
                          {
                            props.postsHeartStatus[pId]
                            ? <svg id={pId} class="bi bi-heart-fill" width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path id={pId} fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" clip-rule="evenodd"/>
                              </svg>
                            : <svg id={pId} class="bi bi-heart" width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path id={pId} fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 01.176-.17C12.72-3.042 23.333 4.867 8 15z" clip-rule="evenodd"/>
                              </svg>
                          }
                        </div>

                      </div>
                      <div className="heart-icon">
                          <Card.Link className="heart-icon" href={`${p.link}`} target="_blank">
                            <svg class="bi bi-link" width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6.354 5.5H4a3 3 0 000 6h3a3 3 0 002.83-4H9c-.086 0-.17.01-.25.031A2 2 0 017 10.5H4a2 2 0 110-4h1.535c.218-.376.495-.714.82-1z"/>
                              <path d="M6.764 6.5H7c.364 0 .706.097 1 .268A1.99 1.99 0 019 6.5h.236A3.004 3.004 0 008 5.67a3 3 0 00-1.236.83z"/>
                              <path d="M9 5.5a3 3 0 00-2.83 4h1.098A2 2 0 019 6.5h3a2 2 0 110 4h-1.535a4.02 4.02 0 01-.82 1H12a3 3 0 100-6H9z"/>
                              <path d="M8 11.33a3.01 3.01 0 001.236-.83H9a1.99 1.99 0 01-1-.268 1.99 1.99 0 01-1 .268h-.236c.332.371.756.66 1.236.83z"/>
                            </svg>
                          </Card.Link>
                      </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <small className="mb-4 text-muted" >
                  {moment(p.createdAt.toDate()).format('LLLL')}
                </small>
              </Card.Footer>
            </Card>
          </CardGroup>
        </Row>
    )
  });

  return (
    <Container className="justify-content-center">
      {allPosts}
    </Container>
  )
}
