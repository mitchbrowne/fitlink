import React, { Component } from 'react';
import firebase from 'firebase';
import { getUser } from '../helpers/fireUtils';

import {
  Image
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
      }
      // user: null
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

  }

  render() {

    return (
      <div>
        <UserProfileHeader user={this.state.user}/>
      </div>

    )
  }
}

const UserProfileHeader = (props) => {
  if (props.user === null) {
    return (<p>Loading</p>)
  }

  return (
    <div>
      <Image src={props.user.photoURL} roundedCircle />
      <h1>{props.user.displayName}</h1>
      <p>{props.user.email}</p>
    </div>
  )
}
