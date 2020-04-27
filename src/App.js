import React, { Component, useState } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import firebase from 'firebase';
import { getUser } from './helpers/fireUtils';

import Layout from './components/Layout';

import Home from './pages/Home';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import NewWorkout from './pages/NewWorkout';
import ShowWorkout from './pages/ShowWorkout';
import EditWorkout from './pages/EditWorkout';
import Signup from './pages/Signup';
import Signin from './pages/Signin';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    }

    this._fetchUpdatedUser = this._fetchUpdatedUser.bind(this);

  }

  async componentDidMount() {
    const db = firebase.firestore();
    const usersRef = db.collection('users');

    await firebase.auth().onAuthStateChanged(async (userProfile) => {
      if (!userProfile){
        this.setState({user: null});
        console.log('No user signed in on state change');
        return null;
      }
      const userDetails = await getUser(userProfile.uid);
      console.log(userDetails.data());

      const user = {
        userId: userProfile.uid,
        postsCount: userDetails.data().postsCount,
        email: userDetails.data().email,
        displayName: userDetails.data().displayName,
        bio: userDetails.data().bio,
        photoURL: userDetails.data().photoURL
      }
      console.log(user);
      this.setState({user: user});
    })
  }

  _fetchUpdatedUser = async (userId) => {
    console.log('FETCHING UPDATED USER');
    const userDetails = await getUser(userId);

    // .then((userData) => {
    //   console.log(userData.data());
    //   const updatedUser = {
    //     userId: userData.id,
    //     postsCount: userData.data().postsCount,
    //     email: userData.data().email,
    //     displayName: userData.data().displayName,
    //     bio: userData.data().bio,
    //     photoURL: userData.data().photoURL
    //   }
    //   this.setState({user: updatedUser});
    //   console.log(updatedUser);
    // });

    const updatedUser = {
      userId: userId,
      postsCount: userDetails.data().postsCount,
      email: userDetails.data().email,
      displayName: userDetails.data().displayName,
      bio: userDetails.data().bio,
      photoURL: userDetails.data().photoURL
    }
    console.log('Updated User: ', updatedUser.postsCount);
    this.setState({user: updatedUser});
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
              path="/workouts/new"
              render={(props) => (
                <NewWorkout {...props} user={this.state.user} fetchUpdatedUser={this._fetchUpdatedUser}/>
              )}
            />
            <Route
              path="/workouts/show/:postId"
              render={(props) => (
                <ShowWorkout {...props} user={this.state.user} fetchUpdatedUser={this._fetchUpdatedUser}/>
              )}
            />
            <Route
              path="/workouts/edit/:postId"
              render={(props) => (
                <EditWorkout {...props} user={this.state.user} />
              )}
            />
            <Route
              exact
              path="/signup"
              render={(props) => (
                <Signup {...props}/>
              )}
            />
            <Route exact path="/signin" component={Signin} />
          </Layout>
        </div>
      </Router>
    )
  }
}
