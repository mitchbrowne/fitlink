import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';

import {
  Navbar,
  Nav,
  NavDropdown,
  Image
} from 'react-bootstrap';

export default (props) => {

  const user = props.user;

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    if (props.user === null) return;
    setDisplayName(props.user.displayName);
    setPhotoURL(props.user.photoURL);
  }, [props]);

  const _handleSignOut = (props) => {
    firebase.auth().signOut().then(function() {
      // sign out successfull
      console.log('signed out');
      props.history.push('/');
    }).catch(function(error) {
      // error occurred
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorMessage);
    })
  }

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand className="navbar-logo" as={Link} to="/">FitLink</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            {user &&
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/home">Home</Nav.Link>
                <Nav.Link as={Link} to="/explore">Explore</Nav.Link>
              </Nav>
            }
          <Nav className="mr-auto">
          </Nav>
          <Nav className="justify-content-end">
            {user
              ? <>
              <NavDropdown
                  alignRight
                  title={
                    <span>
                      {displayName}
                      {photoURL &&
                        <Image src={photoURL} className="navbar-photoURL" roundedCircle />
                      }
                    </span>
                  }
                  id="nav-dropdown"
              >
                <NavDropdown.Item as={Link} to="/workouts/new">Post Workout</NavDropdown.Item>
                <NavDropdown.Item as={Link} to={`/profile/${user.userId}`}>Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/" onClick={_handleSignOut}>Sign Out</NavDropdown.Item>
              </NavDropdown>
              </>
              : <>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
                <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}
