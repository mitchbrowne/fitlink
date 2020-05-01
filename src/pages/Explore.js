import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { queryUsers, queryHashtags, queryUsersSelect } from '../helpers/fireUtils';
import moment from 'moment';

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
      searchType: 2,
      userSearchResults: [],
      hashtagSearchResults: null,
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
      if (searchValue === null) {
        let userSearchResults = [];
        this.setState({userSearchResults: userSearchResults});
        return;
      }
      console.log(searchValue);
      let newTagged = [];
      const convertTaggedObjects = (searchValue) => {
        searchValue.map((taggedObject) => {
          const newObject = {userId: taggedObject.value, displayName: taggedObject.label};
          newTagged.push(newObject);
        });
      }
      convertTaggedObjects(searchValue);
      this.setState({searchLoading: true});
      this.setState({searchType: searchType});
      this.setState({searchValue: newTagged});
      // if (searchValue.startsWith('@')) (searchValue = searchValue.slice(1));
      const userSearchResults = await queryUsersSelect(newTagged);
      this.setState({userSearchResults: userSearchResults});
      this.setState({searchLoading: false});
    }
  }

  render() {
    return (
      <div>
        <Container className="justify-content-md-center">
          <Row className="margin-top-profile margin-bottom-profile justify-content-md-center">
          <SearchBar searchType={this.state.searchType} searchValue={this.state.searchValue} handleSearchSubmit={this._handleSearchSubmit} />
        </Row>
          <hr />
          <Row className="margin-top-profile justify-content-md-center">
          <SearchContent
            searchLoading={this.state.searchLoading}
            searchValue={this.state.searchValue}
            users={this.state.userSearchResults}
            hashtagResults={this.state.hashtagSearchResults}
            searchType={this.state.searchType}
          />
        </Row>
        </Container>
      </div>
    )
  }
}

const SearchContent = (props) => {
  if (props.searchLoading) return (
    <div className="loading-spinner-container">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
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
  if (props.hashtagResults === null) return (
    <h4>...</h4>
  );

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
                <Col xs={12} lg="8">
                  <Link className="main-custom-link" to={`/workouts/show/${post.id}`}>
                    <h1>{p.title}</h1>
                  </Link>
                </Col>
                <Col xs="12" lg="4">
                  <Image src={p.photoURL} className="navbar-photoURL mr-2" roundedCircle />
                  <Card.Link className="main-custom-link" as={Link} to={`/profile/${p.userId}`}>
                    {p.displayName}
                  </Card.Link>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card.Text className="mb-4">{p.desc}</Card.Text>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Card.Subtitle className="mb-2 text-muted">
                    {
                      p.hashtags.map((hashtag) => (
                        <Link className="main-custom-link" to={`/explore/2/${hashtag}`}>
                          #{hashtag}&ensp;
                        </Link>
                      ))
                    }
                  </Card.Subtitle>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card.Subtitle className="mb-2 text-muted">
                    {
                      p.tagged.map((user) => (
                        <Link className="main-custom-link" to={`/profile/${user.userId}`}>
                          @{user.displayName}&ensp;
                        </Link>
                      ))
                    }
                  </Card.Subtitle>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <small className="mb-4 text-muted" >
                {moment(p.createdAt.toDate()).format('LLLL')}
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
      <Row key={user.id} className="d-flex justify-content-center mt-4">
        <Col xs lg="4">
          <Image src={u.photoURL} roundedCircle alt="user profile image" className="profile-image"/>
        </Col>
        <Col xs lg="8" className="justify-content-md-center">
          <Link className="main-custom-link" to={`/profile/${user.id}`} >
            <h3>{u.displayName}</h3>
          </Link>
          <Card.Subtitle className="mb-4 text-muted">{u.bio}</Card.Subtitle>
          <Row>
            <Col xs="8" lg="4">
              <p>{u.followersCount} Followers</p>
            </Col>
            <Col xs="8" lg="4">
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
