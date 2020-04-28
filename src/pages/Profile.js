import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { getUser, getUserPosts, isFollowing, addFollowing, removeFollowing } from '../helpers/fireUtils';
import Timestamp from 'react-timestamp';

import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Button,
  Spinner,
} from 'react-bootstrap';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.match.params.userId,
      userProfile: null,
      posts: null,
      following: false,
      followersCount: 0
    }
    this._handleFollowChange = this._handleFollowChange.bind(this);
  }

  async componentDidMount() {
    const userProfile = await getUser(this.state.userId).then((userProfile) => {
      console.log('Successfully fetched user data.');
      this.setState({userProfile: userProfile.data()});
      this.setState({followersCount: userProfile.data().followersCount});
    }).catch((error) => {
      console.log('Unsuccessfully fetched user data.');
    });

    console.log('Mounted.');
    const posts = await getUserPosts(this.state.userId);
    this.setState({posts: posts})

    const isFollowingBool = await isFollowing(this.state.userId, this.props.user.userId);
    this.setState({following: isFollowingBool});
  }

  _handleFollowChange() {
    console.log('Follow Change');
    if (this.state.following) {
      removeFollowing(this.state.userId, this.props.user.userId);
      const newFollowersCount = this.state.followersCount - 1;
      this.setState({followersCount: newFollowersCount});
    } else {
      addFollowing(this.state.userId, this.props.user.userId);
      const newFollowersCount = this.state.followersCount + 1;
      this.setState({followersCount: newFollowersCount});
    }
    this.setState({following: !this.state.following});
  }

  render() {
    if (this.state.userProfile === null || this.state.posts === null) return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );

    return (
      <div>
        <Container className="justify-content-md-center">
          <UserProfileHeader userProfile={this.state.userProfile} following={this.state.following} followersCount={this.state.followersCount} handleFollowChange={this._handleFollowChange}/>
          <UserProfilePosts posts={this.state.posts}/>
        </Container>
      </div>

    )
  }
}

const UserProfileHeader = (props) => {
  const _handleFollowClick = () => {
    console.log('Follow clicked');
    props.handleFollowChange();
  }

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
              <p>{props.followersCount} Followers</p>
            </Col>
            <Col>
              <p>{props.userProfile.followingCount} Following</p>
            </Col>
            <Col>
              <p>{props.userProfile.postsCount} Posts</p>
            </Col>
          </Row>
          <Row>
            <Button size="sm" onClick={_handleFollowClick}>
              {props.following
                ? ('Following')
                : ('Follow')
              }
            </Button>
          </Row>
        </Col>
      </Row>


    </div>
  )
}

const UserProfilePosts = (props) => {
  const userPosts = props.posts.map((post) => {
    const p = post.data();
    let hashtags = [];
    if (p.hashtags) {
      hashtags = Array.from(p.hashtags);
    }
    return (
        <Col className="mb-4" lg={4} key={post.id}>
          <div>
            <Card>
              <Card.Img variant="top" src={p.image} alt={`${p.title} post image`} className='profile-post-image' />
              <Card.Body>
                <Row>
                  <Link to={`/workouts/show/${post.id}`}>
                  <h4>{p.title}</h4>
                  </Link>
                </Row>
                <Row>
                  <p>
                    {
                      hashtags.map((hashtag) => (
                        <Link to={`/explore/2/${hashtag}`}>
                          #{hashtag}
                        </Link>
                      ))
                    }
                  </p>

                </Row>
              </Card.Body>
              <Card.Footer>
                <small className="mb-4 text-muted" >
                  <Timestamp date={p.createdAt.toDate()}/>
                </small>
              </Card.Footer>
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
