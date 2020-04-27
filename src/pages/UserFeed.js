import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getUserFeedPosts } from '../helpers/fireUtils';

import {
  Container,
  Row,
  Col,
  Card,
} from 'react-bootstrap';

export default class UserFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      posts: null,
    }
  }

  async componentDidUpdate() {
    if (this.state.user === null) {
      this.setState({user: this.props.user});
      // const postsData = await getUserFeedPosts(this.props.user.userId);
      // console.log(postsData);
      // this.setState({posts: postsData});

      const getPostsData = async () => {
        const postsData = await getUserFeedPosts(this.props.user.userId);
        console.log(postsData.flat());
        this.setState({posts: postsData.flat()});
      }

      getPostsData();

    }
  }

  render() {
    if (this.state.user === null || this.state.posts === null) return (<p>Loading User Feed...</p>)

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
    return (
      <Row key={post.id} className="d-flex justify-content-center">
        <Col>
          <Card>
            <Card.Img variant="top" src={p.image} alt={`${p.title} post image`} />
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Row>
                <h2>{p.title}</h2>
              </Row>
              <Row>
                <Link to={`/profile/${p.userId}`}>
                  <h4>{p.displayName}</h4>
                </Link>
              </Row>
              <Row>
                <p>{p.desc}</p>
              </Row>
              <Row>
                <p>
                  {
                    p.hashtags.map((hashtag) => (
                      `#${hashtag}   `
                    ))
                  }
                </p>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    )
  });

  return (
    <div>
      {allPosts}
    </div>
  )
}
