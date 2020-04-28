import React, { Component, useRef } from 'react';
import { Link } from 'react-router-dom';
import { requestUserFeedPosts, getUserFeedPosts, isHearted } from '../helpers/fireUtils';
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
      postsHeartDetails: null
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
        console.log(postsData.flat());
        this.setState({posts: postsData.flat()});

        let newPostsHeartDetails = {};

        const allPosts = postsData.flat().map((post) => {
          const getHeartStatus = () => {
            isHearted(this.props.user.userId, this.props.user.displayName, post.id).then((heartStatus) => {
              const postHeartDetails = {
                [post.id]: heartStatus
              }
              newPostsHeartDetails = Object.assign({}, postHeartDetails, newPostsHeartDetails);
              this.setState({postsHeartDetails: newPostsHeartDetails});
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
        console.log(postsData.flat());
        this.setState({posts: postsData.flat()});

        let newPostsHeartDetails = {};

        const allPosts = postsData.flat().map((post) => {
          const getHeartStatus = () => {
            isHearted(this.props.user.userId, this.props.user.displayName, post.id).then((heartStatus) => {
              const postHeartDetails = {
                [post.id]: heartStatus
              }
              newPostsHeartDetails = Object.assign({}, postHeartDetails, newPostsHeartDetails);
              this.setState({postsHeartDetails: newPostsHeartDetails});
            });
          }
          getHeartStatus();
        });
      }
      getPostsData();
    }
  }

  // async componentDidUpdate() {
  //   if (this.state.user === null) {
  //     this.setState({user: this.props.user});
  //
  //     const getPostsData = async () => {
  //       const postsData = await requestUserFeedPosts(this.props.user.userId);
  //       console.log(postsData.flat());
  //       this.setState({posts: postsData.flat()});
  //
  //       let newPostsHeartDetails = {};
  //
  //       const allPosts = Promise.all(await postsData.flat().map(async (post) => {
  //         const getHeartStatus = async () => {
  //           await isHearted(this.props.user.userId, this.props.user.displayName, post.id).then((heartStatus) => {
  //             const postHeartDetails = {
  //               [post.id]: heartStatus
  //             }
  //             newPostsHeartDetails = Object.assign({}, postHeartDetails, newPostsHeartDetails);
  //             this.setState({postsHeartDetails: newPostsHeartDetails});
  //             return Promise.resolve('ok');
  //           });
  //         }
  //         await getHeartStatus();
  //       }));
  //     }
  //     getPostsData();
  //   }
  // }

  // async componentDidUpdate() {
  //   if (this.state.user === null) {
  //     this.setState({user: this.props.user});
  //
  //     const getPostsData = async () => {
  //       const postsData = await requestUserFeedPosts(this.props.user.userId);
  //       console.log(postsData.flat());
  //       this.setState({posts: postsData.flat()});
  //
  //       let newPostsHeartDetails = {};
  //       const allPosts = postsData.flat().map((post) => {
  //         const postHeartDetails = {
  //           [post.id]: true
  //         }
  //         newPostsHeartDetails = Object.assign({}, postHeartDetails, newPostsHeartDetails);
  //       });
  //       this.setState({postsHeartDetails: newPostsHeartDetails});
  //
  //     }
  //
  //     getPostsData();
  //
  //   }
  // }

  _handleHeartClick(postId, heartStatus) {
    const postHeartDetails = {
      [postId]: !heartStatus
    }
    const newPostsHeartDetails = Object.assign({}, this.state.postsHeartDetails, postHeartDetails);
    this.setState({postsHeartDetails: newPostsHeartDetails});
  }

  render() {
    if (this.state.user === null || this.state.posts === null || this.state.postsHeartDetails === null) return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    )

    return (
      <div>
        <Container className="justify-content-md-center">
          <UserFeedPosts posts={this.state.posts} postsHeartDetails={this.state.postsHeartDetails} handleHeartClick={this._handleHeartClick}/>
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
                    p.hashtags.map((hashtag) => (
                      `#${hashtag}   `
                    ))
                  }
                </Card.Subtitle>
              </Row>
              <Row>
                <Card.Text>
                  {p.heartsCount} Hearts
                </Card.Text>
              </Row>
              <Row>
                <Card.Link as={Link} to="#" name={pId} onClick={(e) => {_handleHeartClick(e, props.postsHeartDetails[pId])}}>{
                  props.postsHeartDetails[pId]
                  ? ('Unlike')
                  : ('Like')
                }</Card.Link>
                <Card.Link as={Link} to="#">Comment</Card.Link>
                <Card.Link as={Link} to="#">Link</Card.Link>
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
