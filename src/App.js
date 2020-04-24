import React, { useState } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import firebase from 'firebase';

import Layout from './components/Layout';

import Home from './pages/Home';
import Settings from './pages/Settings';
import Signup from './pages/Signup';
import Signin from './pages/Signin';


export default () => {
  const [user, setUser] = useState(null);

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      setUser(user);
      console.log(user.email);
      console.log('user state change');
    } else {
      setUser(null)
      console.log('No user signed in on state change');
    }
  })

  const _fetchUpdatedUser = (user) => {
    setUser(user)
    console.log(user.displayName);
    console.log('updated user');
  }

  return (
    <Router>
      <div>
        <Layout user={user}>
          <Route
            exact
            path="/"
            render={(props) => (
              <Home {...props} user={user} />
            )}
          />
          <Route
            exact
            path="/settings"
            render={(props) => (
              <Settings {...props} user={user} fetchUpdatedUser={_fetchUpdatedUser}/>
            )}
             />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/signin" component={Signin} />
        </Layout>
      </div>
    </Router>
  )
}
