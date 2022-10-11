import { Component } from 'react';
import { RecipeSummary } from '../types/recipes';

class RecipeSummaryBlock extends Component<{ recipe: RecipeSummary, recipeId: string }, {}> {
  render() {
    return (
      <li>{this.props.recipe.name}</li>
    )
  }
}

export default RecipeSummaryBlock;