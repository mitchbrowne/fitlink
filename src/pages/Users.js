import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../helpers/fireUtils';

import {
  Container,
  Spinner
} from 'react-bootstrap';

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null,
    }

  }

  async componentDidMount() {
    const allUsers = await getUsers();
    this.setState({users: allUsers});
  }

  render() {
    if (this.state.users === null || this.props.user === null) return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );

    return (
      <div>
        <Container>
          <ShowUsers users={this.state.users}/>
        </Container>
      </div>
    )
  }
}

const ShowUsers = (props) => {
  const allUsers = props.users.map((user) => {
    const u = user.data();
    return (
      <div key={user.id}>
        <Link to={`/profile/${user.id}`}>
          {u.displayName}
        </Link>
      </div>
    )
  })

  console.log(props.users);
  return (
    <div>
      {allUsers}
    </div>
  )
}
