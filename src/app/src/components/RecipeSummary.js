import { Component } from 'react';

class RecipeSummary extends Component {
  render() {
    return (
      <li>{this.props.recipe.name}</li>
    )
  }
}

export default RecipeSummary;