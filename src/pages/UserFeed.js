import React, { Component, useRef } from 'react';
import { Link } from 'react-router-dom';
import { requestUserFeedPosts, getUserFeedPosts, isHearted, addHeart, removeHeart } from '../helpers/fireUtils';
import Timestamp from 'react-timestamp';

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
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    )

    if (this.state.user === null || this.state.posts.length === 0) return (
      <h1>You have no posts... Maybe follow some friends?</h1>
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
    props.handleHeartClick(e.target.name, heartStatus);
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
                  <Link to={`/workouts/show/${pId}`}>
                    <Card.Title>{p.title}</Card.Title>
                  </Link>
                </Row>
                <Row>
                  <Image src={p.photoURL} className="navbar-photoURL" roundedCircle />
                  <Link to={`/profile/${p.userId}`}>
                    <Card.Subtitle className="mb-4 text-muted">{p.displayName}</Card.Subtitle>
                  </Link>
                </Row>
                <Row>
                  <Card.Text className="mb-4">{p.desc}</Card.Text>
                </Row>
                <Row>
                  <Card.Subtitle className="mb-2 text-muted">
                    {
                      p.tagged.map((user) => (
                        <Link to={`/profile/${user.userId}`}>
                          @{user.displayName}
                        </Link>
                      ))
                    }
                  </Card.Subtitle>
                </Row>
                <Row>
                  <Card.Subtitle className="mb-2 text-muted">
                    {
                      p.hashtags.map((hashtag) => (
                        <Link to={`/explore/2/${hashtag}`}>
                          #{hashtag}
                        </Link>
                      ))
                    }
                  </Card.Subtitle>
                </Row>
                <Row>
                  <Card.Text>
                    {props.postsHeartCount[pId]} Hearts
                  </Card.Text>
                </Row>
                <Row>
                  <Card.Link as={Link} to="#" name={pId} onClick={(e) => {_handleHeartClick(e, props.postsHeartStatus[pId])}}>{
                    props.postsHeartStatus[pId]
                    ? ('Unlike')
                    : ('Like')
                  }</Card.Link>
                  <Card.Link href={`${p.link}`} target="_blank">Link</Card.Link>
                </Row>
              </Card.Body>
              <Card.Footer>
                <small className="mb-4 text-muted" >
                  <Timestamp date={p.createdAt.toDate()}/>
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
