import React, { Component } from 'react';
import Select from 'react-select';

export default class SearchBarTagged extends Component {
  constructor() {
    super();
    this.state = {
      selectedOptions: [],
      searchList: [
        { value: 'chocolate', label: 'Chocolate' },
{ value: 'strawberry', label: 'Strawberry' },
{ value: 'vanilla', label: 'Vanilla' }
      ]
    }
  }

  handleChange = selectedOption => {
    this.setState({selectedOption});
  }

  render() {
    return (
      <Select
        value={this.state.selectedOption}
        options={this.state.searchList}
        onChange={this.handleChange}
        isMulti
        placeholder="Search..."
        openMenuOnClick={false}
       />
    )
  }
}
