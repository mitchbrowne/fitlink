import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { getUser, getUserPosts, isFollowing, addFollowing, removeFollowing, getUserTaggedPosts, getUserFollowers, getUserFollowing } from '../helpers/fireUtils';
import Timestamp from 'react-timestamp';
// import ProfileContent from '../components/ProfileContent';

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
      searchLoading: false,
      userId: props.match.params.userId,
      userProfile: null,
      posts: null,
      followingData: null,
      followersData: null,
      taggedData: null,
      following: false,
      followersCount: 0,
      view: 'posts',
    }
    this._handleFollowChange = this._handleFollowChange.bind(this);
    this._handleViewClick = this._handleViewClick.bind(this);
    this._handleFollowersQuery = this._handleFollowersQuery.bind(this);
    this._handleTaggedQuery = this._handleTaggedQuery.bind(this);
  }

  async componentDidMount() {
    const userProfile = await getUser(this.props.match.params.userId).then((userProfile) => {
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

  async componentDidUpdate(prevProps) {
    if (this.props.match.params.userId !== prevProps.match.params.userId) {
      this.setState({searchLoading: true});
      const userProfile = await getUser(this.props.match.params.userId).then((userProfile) => {
        console.log('Successfully fetched user data.');
        this.setState({userProfile: userProfile.data()});
        this.setState({followersCount: userProfile.data().followersCount});
        this.setState({userId: this.props.match.params.userId});
      }).catch((error) => {
        console.log('Unsuccessfully fetched user data.');
      });

      console.log('Mounted.');
      const posts = await getUserPosts(this.state.userId);
      this.setState({posts: posts})

      const isFollowingBool = await isFollowing(this.state.userId, this.props.user.userId);
      this.setState({following: isFollowingBool});

      this.setState({view: 'posts'});
      this.setState({searchLoading: false});
    }
  }

  _handleFollowChange() {
    console.log('Follow Change');
    if (this.state.following) {
      removeFollowing(this.state.userId, this.state.userProfile.displayName, this.state.userProfile.photoURL, this.props.user.userId, this.props.user.displayName, this.props.user.photoURL);
      const newFollowersCount = this.state.followersCount - 1;
      this.setState({followersCount: newFollowersCount});
    } else {
      addFollowing(this.state.userId, this.state.userProfile.displayName, this.state.userProfile.photoURL, this.props.user.userId, this.props.user.displayName, this.props.user.photoURL);
      const newFollowersCount = this.state.followersCount + 1;
      this.setState({followersCount: newFollowersCount});
    }
    this.setState({following: !this.state.following});
  }

  _handleFollowersQuery() {
    getUserFollowers(this.state.userId).then((followersData) => {
      console.log(followersData);
      this.setState({followersData: followersData});
      this.setState({searchLoading: false});
    })
  }

  _handleFollowingQuery() {
    getUserFollowing(this.state.userId).then((followingData) => {
      console.log(followingData);
      this.setState({followingData: followingData});
      this.setState({searchLoading: false});
    })
  }

  _handleTaggedQuery() {
    getUserTaggedPosts(this.state.userId).then((taggedData) => {
      console.log(taggedData);
      this.setState({taggedData: taggedData});
      this.setState({searchLoading: false});
    });
  }

  _handleViewClick(view) {
    if (view === 'tagged' && this.state.taggedData === null) {
      this._handleTaggedQuery();
      this.setState({searchLoading: true});
    }
    if (view === 'followers' && this.state.followersData === null) {
      this._handleFollowersQuery();
      this.setState({searchLoading: true});
    }
    if (view === 'following' && this.state.followingData === null) {
      this._handleFollowingQuery();
      this.setState({searchLoading: true});
    }
    this.setState({view: view});
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
          <UserProfileHeader
            userProfile={this.state.userProfile}
            following={this.state.following}
            followersCount={this.state.followersCount}
            handleFollowChange={this._handleFollowChange}
            handleViewClick={this._handleViewClick}
          />
          <ProfileContent
            searchLoading={this.state.searchLoading}
            view={this.state.view}
            posts={this.state.posts}
            followingData={this.state.followingData}
            followersData={this.state.followersData}
            taggedData={this.state.taggedData}
          />
        </Container>
      </div>

    )
  }
}

const ProfileContent = (props) => {
  if (props.searchLoading) return (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  )

  if (props.view === 'posts') {
    return (
      <UserProfilePosts posts={props.posts} />
    )
  }

  if (props.view === 'following') {
    console.log(props.followingData);
    return (
      <div>
        <h3>Following</h3>
        <UserProfileFollow followData={props.followingData} />
      </div>
    )
  }

  if (props.view === 'followers') {
    console.log(props.followersData);
    return (
      <div>
        <h3>Followers</h3>
        <UserProfileFollow followData={props.followersData} />
      </div>
    )
  }

  if (props.view === 'tagged') {
    console.log(props.taggedData);
    return (
      <div>
        <h3>Tagged</h3>
        <UserProfileTagged taggedData={props.taggedData} />
      </div>
    )
  }

  return (
    <h2>Show no content...</h2>
  )
}

const UserProfileHeader = (props) => {
  const _handleFollowClick = () => {
    props.handleFollowChange();
  }

  const _handleViewClick = (e) => {
    e.preventDefault();
    props.handleViewClick(e.target.name);
  }

  return (
    <div>
      <Row md="6" className="justify-content-md-center">
        <Col xs lg="2">
          <Image src={props.userProfile.photoURL} roundedCircle alt="user profile image" className="profile-image"/>
        </Col>
        <Col xs lg="6" className="justify-content-md-center">
          <h1>{props.userProfile.displayName}</h1>
          <h4>{props.userProfile.bio}</h4>
          <Row>
            <Col>
              <Link to={'#'} name={'followers'} onClick={_handleViewClick}>
                {props.followersCount} Followers
              </Link>
            </Col>
            <Col>
              <Link to={'#'} name={'following'} onClick={_handleViewClick}>
                {props.userProfile.followingCount} Following
              </Link>
            </Col>
            <Col>
              <Link to={'#'} name={'posts'} onClick={_handleViewClick}>
                {props.userProfile.postsCount} Posts
              </Link>
            </Col>
            <Col>
              <Link to={'#'} name={'tagged'} onClick={_handleViewClick}>
                {props.userProfile.taggedCount} Tagged
              </Link>
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

const UserProfileFollow = (props) => {
  const follow = props.followData.map((followUser) => {
    const u = followUser;

    return (
      <Row key={u.userId} md="12" className="d-flex justify-content-center mt-4">
        <Col xs lg="8">
          <Image src={u.photoURL} roundedCircle alt="user profile image" className="profile-image"/>
        </Col>
        <Col xs ls="4" className="justify-content-md-center">
          <Link to={`/profile/${u.userId}`} >
            <h3>{u.displayName}</h3>
          </Link>
        </Col>
      </Row>
    )
  })

  return (
    <div>
      <Container>
        <Row>
          {follow}
        </Row>
      </Container>
    </div>
  )
}

const UserProfileTagged = (props) => {
  const tagged = props.taggedData.map((taggedPost) => {
    const t = taggedPost.data();
    console.log(taggedPost.id);
    console.log(t);
    return (
      <Col className="mb-4" lg={4} key={taggedPost.id}>
        <div>
          <Card>
            <Card.Img variant="top" src={t.image} alt={`${t.title} tagged image`} className='tagged-image' />
            <Card.Body>
              <Row>
                <Link to={`/workouts/show/${taggedPost.id}`}>
                <h4>{t.title}</h4>
                </Link>
              </Row>
              <Row>
                <Link to={`/profile/${t.userId}`}>
                  <Card.Subtitle className="mb-4 text-muted">{t.displayName}</Card.Subtitle>
                </Link>
              </Row>
              <Row>
                <p>
                  {
                    t.tagged.map((taggedUser) => (
                      <Link to={`/profile/${taggedUser.userId}`}>
                        @{taggedUser.displayName}
                      </Link>
                    ))
                  }
                </p>
              </Row>
              <Row>
                <p>
                  {
                    t.hashtags.map((hashtag) => (
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
                <Timestamp date={t.createdAt.toDate()}/>
              </small>
            </Card.Footer>
          </Card>
        </div>
      </Col>
    )
  })

  return (
    <div>
      <Container>
        <Row>
          {tagged}
        </Row>
      </Container>
    </div>
  )
}
