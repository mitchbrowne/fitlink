import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { requestUserFeedPosts, getUserFeedPosts } from '../helpers/fireUtils';
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
    }
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
      }

      getPostsData();

    }
  }

  render() {
    if (this.state.user === null || this.state.posts === null) return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    )

    return (
      <div>
        <Container className="justify-content-md-center">
          <UserFeedPosts posts={this.state.posts}/>
        </Container>
      </div>
    )
  }
}

const UserFeedPosts = (props) => {
  const allPosts = props.posts.map((post) => {
    const p = post.data();
    console.log(p);
    return (
      <Row key={post.id} className="d-flex justify-content-center  mt-4">
        <CardGroup>
          <Card className="w-75 mb-4">
            <Card.Img variant="top" src={p.image} alt={`${p.title} post image`} />
          </Card>
          <Card className="w-75 mb-4">
            <Card.Body>
              <Row>
                <Link to={`/workouts/show/${post.id}`}>
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
