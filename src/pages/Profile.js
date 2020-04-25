import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { getUser, getUserPosts } from '../helpers/fireUtils';

import {
  Image,
} from 'react-bootstrap';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.match.params.userId,
      user: {
        displayName: 'Mitch',
        email: 'mfbrowne18@gmail.com',
        photoURL: `https://api.adorable.io/avatars/290/mfbrowne18@gmail.com.png`
      },
      // user: null,
      posts: null
    }
  }

  async componentDidMount() {
    // const user = await getUser(this.state.userId).then((user) => {
    //   console.log('Successfully fetched user data.');
    //   this.setState({user: user.data()});
    // }).catch((error) => {
    //   console.log('Unsuccessfully fetched user data.');
    // });
    console.log('Mounted.');
    const posts = await getUserPosts(this.state.userId);
    this.setState({posts: posts})
  }

  render() {
    if (this.state.user === null || this.state.posts === null) return (<p>Loading Profile...</p>);

    return (
      <div>
        <UserProfileHeader user={this.state.user}/>
        <UserProfilePosts posts={this.state.posts}/>
      </div>

    )
  }
}

const UserProfileHeader = (props) => {
  return (
    <div>
      <Image src={props.user.photoURL} roundedCircle alt="user profile image"/>
      <h1>{props.user.displayName}</h1>
      <p>{props.user.email}</p>
    </div>
  )
}

const UserProfilePosts = (props) => {
  console.log(props.posts);
  const userPosts = props.posts.map((post) => {
    const p = post.data();
    return (
      <div key={post.id}>
        <Link to={`/workouts/show/${post.id}`}>
          <h4>{p.title}</h4>
        </Link>
        <Image src={p.image} alt={`${p.title} post image`} />
      </div>
    )
  });

  return(
    <div>
      <h1>Posts</h1>
      <div>
        {userPosts}
      </div>
    </div>
  )
}
