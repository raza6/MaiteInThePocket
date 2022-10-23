import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RecipeSummary } from '../types/recipes';
import { getRecipeImg } from '../utils';
import './RecipeSummaryBlock.scss';

class RecipeSummaryBlock extends Component<{ recipe: RecipeSummary, recipeId: string }, {}> {
  render() {
    return (
      <li>
        <Link to={`/app/recipe/detail/${this.props.recipeId}`}>
          <Card>
            <Card.Img variant="top" src={getRecipeImg(this.props.recipeId, this.props.recipe.hasImg)} />
            <Card.Body className="recipeName">
              <Card.Title>{this.props.recipe.name}</Card.Title>
            </Card.Body>
          </Card>
        </Link>
      </li>
    );
  }
}

export default RecipeSummaryBlock;