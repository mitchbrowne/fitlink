import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { getUser, getUserPosts } from '../helpers/fireUtils';
import Timestamp from 'react-timestamp';

import {
  Container,
  Row,
  Col,
  Card,
  Image,
} from 'react-bootstrap';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.match.params.userId,
      // user: {
      //   displayName: 'Mitch',
      //   bio: 'Healthy mind and body',
      //   photoURL: `https://api.adorable.io/avatars/290/mfbrowne18@gmail.com.png`,
      //   followingCount: 10,
      //   followersCount: 12,
      // },
      userProfile: null,
      posts: null
    }
  }

  async componentDidMount() {
    const userProfile = await getUser(this.state.userId).then((userProfile) => {
      console.log('Successfully fetched user data.');
      this.setState({userProfile: userProfile.data()});
    }).catch((error) => {
      console.log('Unsuccessfully fetched user data.');
    });

    console.log('Mounted.');
    const posts = await getUserPosts(this.state.userId);
    this.setState({posts: posts})
  }

  render() {
    if (this.state.userProfile === null || this.state.posts === null) return (<p>Loading Profile...</p>);

    return (
      <div>
        <Container className="justify-content-md-center">
          <UserProfileHeader userProfile={this.state.userProfile}/>
          <UserProfilePosts posts={this.state.posts}/>
        </Container>
      </div>

    )
  }
}

const UserProfileHeader = (props) => {
  return (
    <div>
      <Row md="6" className="justify-content-md-center">
        <Col xs lg="2">
          <Image src={props.userProfile.photoURL} roundedCircle alt="user profile image" className="profile-image"/>
        </Col>
        <Col xs lg="4" className="justify-content-md-center">
          <h1>{props.userProfile.displayName}</h1>
          <h4>{props.userProfile.bio}</h4>
          <Row>
            <Col>
              <p>{props.userProfile.followingCount} Following</p>
            </Col>
            <Col>
              <p>{props.userProfile.followersCount} Followers</p>
            </Col>
            <Col>
              <p>{props.userProfile.postsCount} Posts</p>
            </Col>
          </Row>
        </Col>
      </Row>


    </div>
  )
}

const UserProfilePosts = (props) => {
  const userPosts = props.posts.map((post) => {
    const p = post.data();
    return (
        <Col lg={4} key={post.id}>
          <div>
            <Card>
              <Card.Img variant="top" src={p.image} alt={`${p.title} post image`} className='profile-post-image' />
              <Card.Body>
                <Link to={`/workouts/show/${post.id}`}>
                <h4>{p.title}</h4>
                </Link>
                <Timestamp date={p.createdAt.toDate()} />
                <Card.Link as={Link} to="#">Like</Card.Link>
                <Card.Link as={Link} to="#">Comment</Card.Link>
                <Card.Link as={Link} to="#">Link</Card.Link>
              </Card.Body>
            </Card>
          </div>
        </Col>
    )
  });

  return(
    <div>
      <h1>Posts</h1>
      <Container>
        <Row>
          {userPosts}
        </Row>
      </Container>
    </div>
  )
}
