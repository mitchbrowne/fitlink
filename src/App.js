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
        console.log('No user signed in on state change');
        return null;
      }
      const user = await getUser(userProfile.uid);
      console.log(user.data());
      this.setState({user: user.data()});
    })

    // const user = await getSignedInUser().then((user) => {
    //   console.log("HEY");
    //   console.log(user);
    // });
    // console.log(user);

    // const db = firebase.firestore();
    // const usersRef = db.collection('users');
    //
    // await firebase.auth().onAuthStateChanged((user) => {
    //   if (user){
    //     const userDetails = getUser(user.uid);
    //     this.setState({user: userDetails});
    //     console.log(userDetails);
    //     console.log('user state change');
    //   } else {
    //     this.setState({user: null})
    //     console.log('No user signed in on state change');
    //   }
    // })
  }

  _fetchUpdatedUser = (user) => {
    this.setState({user: user});
    console.log(user);
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
                <NewWorkout {...props} user={this.state.user} />
              )}
            />
            <Route
              path="/workouts/show/:workoutId"
              render={(props) => (
                <ShowWorkout {...props} user={this.state.user} />
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
