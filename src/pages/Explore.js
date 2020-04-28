import React, { Component } from 'react';
import { queryUsers } from '../helpers/fireUtils';
import SearchBar from '../components/SearchBar';

import {
  Container,
  Spinner,
  Row,
  Card,
  CardGroup,
  Col,
  Image,
} from 'react-bootstrap';

export default class Explore extends Component {
  constructor() {
    super();
    this.state = {
      searchValues: '',
      searchType: 1,
      userSearchResults: null,
    }

    this._handleSearchSubmit = this._handleSearchSubmit.bind(this);
  }

  async _handleSearchSubmit(searchValue, searchType) {
    console.log('Searching for ' + searchValue);
    console.log('Search type: ' + searchType);
    if (searchType === 4) {
      this.setState({searchType: searchType});
      this.setState({searchValues: searchValue});
      if (searchValue.startsWith('@')) (searchValue = searchValue.slice(1));
      console.log(searchValue);
      const userSearchResults = await queryUsers(searchValue);
      this.setState({userSearchResults: userSearchResults});
    }
  }

  render() {
    return (
      <div>
        <Container>
          <h1>
            Explore
          </h1>
          <SearchBar handleSearchSubmit={this._handleSearchSubmit}/>
          {(this.state.searchType === 4 && this.state.userSearchResults !== null)
            ? <ShowUserResults searchValue={this.state.searchValues} users={this.state.userSearchResults}/>
            : <p>No Results</p>
          }
        </Container>
      </div>
    )
  }
}

const ShowUserResults = (props) => {
  console.log('First Results');
  if (props.userSearchResults === null) return (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  )

  console.log(props.users[0].data());

  const userResults = props.users.map((user) => {
    const u = user.data();
    return (
      <Row key={user.id} md="12" className="d-flex justify-content-center mt-4">
        <Col xs lg="2">
          <Image src={u.photoURL} roundedCircle alt="user profile image" className="profile-image"/>
        </Col>
        <Col xs ls="4" className="justify-content-md-center">
          <h3>{u.displayName}</h3>
          <Card.Subtitle className="mb-4 text-muted">{u.bio}</Card.Subtitle>
          <Row>
            <Col xs="8" lg="2">
              <p>{u.followersCount} Followers</p>
            </Col>
            <Col xs="8" lg="2">
              <p>{u.followingCount} Following</p>
            </Col>
            <Col xs="8" lg="2">
              <p>{u.postsCount} Posts</p>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  })

  return (
    <div>
      <h4>User Search Results Matching {props.searchValue}</h4>
        {userResults}
    </div>
  )
}



{/* <Row key={user.id} md="12" className="d-flex justify-content-center mt-4">
  <CardGroup>
    <Card className="w-75 mb-4">
        <Image src={u.photoURL} roundedCircle alt="user profile image" className="profile-image"/>
    </Card>
    <Card className="w-75 mb-4">
      <Card.Body className="justify-content-md-center">
        <h3>{u.displayName}</h3>
        <Card.Subtitle className="mb-4 text-muted">{u.bio}</Card.Subtitle>
        <Row>
          <Col>
            <Card.Subtitle className="mb-4 text-muted">{u.followersCount} Followers</Card.Subtitle>
          </Col>
          <Col>
            <Card.Subtitle className="mb-4 text-muted">{u.followingCount} Following</Card.Subtitle>
          </Col>
          <Col>
            <Card.Subtitle className="mb-4 text-muted">{u.postsCount} Posts</Card.Subtitle>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </CardGroup>

</Row> */}
