import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RecipeSummary } from '../types/recipes';
import './RecipeSummaryBlock.scss';

class RecipeSummaryBlock extends Component<{ recipe: RecipeSummary, recipeId: string }, {}> {
  render() {
    return (
      <li>
        <Link to={`/recipe/detail/${this.props.recipeId}`}>
          <Card>
            <Card.Img variant="top" src={process.env.PUBLIC_URL + '/placeholder.jpg'} />
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