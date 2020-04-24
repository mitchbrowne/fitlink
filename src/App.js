import React, { Component, useState } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import firebase from 'firebase';

import Layout from './components/Layout';

import Home from './pages/Home';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Signin from './pages/Signin';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      usersRef: null
    }

    this._fetchUpdatedUser = this._fetchUpdatedUser.bind(this);
    this._addUserToDB = this._addUserToDB.bind(this);
  }

  componentDidMount() {
    const db = firebase.firestore();
    const usersRef = db.collection('users');
    this.setState({usersRef: usersRef});

    firebase.auth().onAuthStateChanged((user) => {

      if (user){
        this.setState({user: user});
        console.log(user.email);
        console.log('user state change');
      } else {
        this.setState({user: null})
        console.log('No user signed in on state change');
      }
    })
  }


  _addUserToDB = (userID, email, displayName, photoURL) => {
    console.log(userID);
    this.state.usersRef.doc(userID).set({
      email: email,
      displayName: displayName,
      photoURL: photoURL
    }).then(function() {
      this.props.history.push('/');
      window.location.reload(false);
    }).catch(function() {

    });
  }

  _fetchUpdatedUser = (user) => {
    this.setState({user: user})
    console.log(user.displayName);
    console.log('updated user');
  }

  render() {
    const user = this.state.user
    return (
      <Router>
        <div>
          <Layout user={this.state.user}>
            <Route
              exact
              path="/"
              render={(props) => (
                <Home {...props} user={this.state.user} />
              )}
            />
            <Route
              exact
              path="/settings"
              render={(props) => (
                <Settings {...props} user={this.state.user} fetchUpdatedUser={this._fetchUpdatedUser}/>
              )}
               />
            <Route
              exact
              path="/profile/:userId"
              render={(props) => (
                <Profile {...props} user={this.state.user} />
              )}
            />
            <Route
              exact
              path="/signup"
              render={(props) => (
                <Signup {...props} addUsertoDB={this._addUserToDB} />
              )}
            />
            <Route exact path="/signin" component={Signin} />
          </Layout>
        </div>
      </Router>
    )
  }
}
