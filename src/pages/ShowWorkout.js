import React, { Component } from 'react';
import { getPost } from '../helpers/fireUtils';

export default class ShowWorkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: props.match.params.workoutId,
      post: null
    }
  }

  async componentDidMount() {
    const post = await getPost(this.state.postId);
    console.log(post.data());
    this.setState({post: post.data()});
  }

  render() {
    if (this.state.post === null) return (<p>Loading Workout...</p>)
    return (
      <div>
        <h1>{this.state.post.title}</h1>
        <h3>{this.state.post.displayName}</h3>
        <p>{this.state.post.desc}</p>
        <a href={this.state.post.link} target="_blank">Link to workout</a>
        <img src={this.state.post.image} alt="workout photo"/>
      </div>
    )
  }

}
