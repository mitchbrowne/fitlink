import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { queryUsers, queryHashtags } from '../helpers/fireUtils';
import Timestamp from 'react-timestamp';

import SearchBar from '../components/SearchBar';

import {
  Container,
  Spinner,
  Row,
  Col,
  Card,
  CardGroup,
  Image,
} from 'react-bootstrap';

export default class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchLoading: false,
      searchValue: '',
      searchType: 1,
      userSearchResults: [],
      hashtagSearchResults: [],
    }

    this._handleSearchSubmit = this._handleSearchSubmit.bind(this);
  }

  componentDidMount() {
    const searchType = this.props.match.params.searchType;
    let searchValue = [this.props.match.params.searchValue];

    if (searchType) {
      this.setState({searchType: parseInt(searchType)});
      this.setState({searchValue})
      this._handleSearchSubmit(searchValue, parseInt(searchType));
    }

  }

  async _handleSearchSubmit(searchValue, searchType) {
    console.log(searchValue);
    console.log(searchType);

    if (searchType === 2) {
      this.setState({searchLoading: true});
      this.setState({searchType: searchType});
      this.setState({searchValue: searchValue});
      const hashtagSearchResults = await queryHashtags(searchValue);
      console.log(hashtagSearchResults);
      this.setState({hashtagSearchResults: hashtagSearchResults});
      this.setState({searchLoading: false});
    }

    if (searchType === 4) {
      this.setState({searchLoading: true});
      this.setState({searchType: searchType});
      this.setState({searchValue: searchValue});
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
          <SearchBar searchType={this.state.searchType} searchValue={this.state.searchValue} handleSearchSubmit={this._handleSearchSubmit} />
          <SearchContent
            searchLoading={this.state.searchLoading}
            searchValue={this.state.searchValue}
            users={this.state.userSearchResults}
            hashtagResults={this.state.hashtagSearchResults}
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

  if (props.searchType === 2) return (
    <ShowHashtagResults searchValue={props.searchValue} hashtagResults={props.hashtagResults} />
  )

  if (props.searchType === 4) return (
      <ShowUserResults searchValue={props.searchValue} users={props.users}/>
  )

  return (
    <h4></h4>
  )

}

const ShowHashtagResults = (props) => {
  if (props.hashtagResults.length === 0) return (
    <h4>No Results</h4>
  );

  const showResults = props.hashtagResults.map((post) => {
    const p = post.data();
    console.log(p);
    return (
      <Row key={post.id} className="d-flex justify-content-center mt-4">
        <CardGroup>
          <Card className="w-75 mb-4">
            <Card.Img variant="top" src={p.image} alt={`${p.title} post image`} />
          </Card>
          <Card className="w-75 mb-4">
            <Card.Body>
              <Row>
                <Link to={`/workouts/show/${post.id}`}>
                  <Card.Title>{p.title}</Card.Title>
                </Link>
              </Row>
              <Row>
                <Image src={p.photoURL} className="navbar-photoURL" roundedCircle />
                <Link to={`/profile/${p.userId}`}>
                  <Card.Subtitle className="mb-4 text-muted">{p.displayName}</Card.Subtitle>
                </Link>
              </Row>
              <Row>
                <Card.Text className="mb-4">{p.desc}</Card.Text>
              </Row>
              <Row>
                <Card.Subtitle className="mb-2 text-muted">
                  {
                    p.tagged.map((user) => (
                      <Link to={`/profile/${user.userId}`}>
                        @{user.displayName}
                      </Link>
                    ))
                  }
                </Card.Subtitle>
              </Row>
              <Row>
                <Card.Subtitle className="mb-2 text-muted">
                  {
                    p.hashtags.map((hashtag) => (
                      <Link to={`/explore/2/${hashtag}`}>
                        #{hashtag}
                      </Link>
                    ))
                  }
                </Card.Subtitle>
              </Row>
            </Card.Body>
            <Card.Footer>
              <small className="mb-4 text-muted">
                <Timestamp date={p.createdAt.toDate()}/>
              </small>
            </Card.Footer>
          </Card>
        </CardGroup>
      </Row>
    )
  });

  return (
    <div>
      <Container className="justify-content-md-center">
        {showResults}
      </Container>
    </div>
  )
}

const ShowUserResults = (props) => {
  if (props.users.length === 0) return (
    <h4>No Results</h4>
  )
  console.log(props.users);
  const showResults = props.users.map((user) => {
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
        {showResults}
      </Container>
    </div>
  )
}
