import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { queryUsers } from '../helpers/fireUtils';
import SearchBar from '../components/SearchBar';

import {
  Container,
  Spinner,
  Row,
  Col,
  Card,
  Image,
} from 'react-bootstrap';

export default class Explore extends Component {
  constructor() {
    super();
    this.state = {
      searchLoading: false,
      searchValues: '',
      searchType: 1,
      userSearchResults: null,
    }

    this._handleSearchSubmit = this._handleSearchSubmit.bind(this);
  }

  async _handleSearchSubmit(searchValue, searchType) {

    if (searchType === 4) {
      this.setState({searchLoading: true});
      this.setState({searchType: searchType});
      this.setState({searchValues: searchValue});
      if (searchValue.startsWith('@')) (searchValue = searchValue.slice(1));
      const userSearchResults = await queryUsers(searchValue);
      this.setState({userSearchResults: userSearchResults});
      this.setState({searchLoading: false});
    }
  }

  render() {
    return (
      <div>
        <Container>
          <h1>
            Explore
          </h1>
          <SearchBar handleSearchSubmit={this._handleSearchSubmit} />
          <SearchContent
            searchLoading={this.state.searchLoading}
            searchValue={this.state.searchValues}
            users={this.state.userSearchResults}
            searchType={this.state.searchType}
          />
        </Container>
      </div>
    )
  }
}

const SearchContent = (props) => {
  if (props.searchLoading) return (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  )

  if (props.searchType === 4) return (
      <ShowUserResults searchValue={props.searchValue} users={props.users}/>
  )

  return (
    <h4></h4>
  )

}

const ShowUserResults = (props) => {
  if (props.userSearchResults === null) return (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  )

  const userResults = props.users.map((user) => {
    const u = user.data();
    return (
      <Row key={user.id} md="12" className="d-flex justify-content-center mt-4">
        <Col xs lg="2">
          <Image src={u.photoURL} roundedCircle alt="user profile image" className="profile-image"/>
        </Col>
        <Col xs ls="4" className="justify-content-md-center">
          <Link to={`/profile/${user.id}`} >
            <h3>{u.displayName}</h3>
          </Link>
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
      <Container className="justify-content-md-center">
        {userResults}
      </Container>
    </div>
  )
}
