import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RecipeSummary } from '../types/recipes';
import { getRecipeImg } from '../utils';
import './RecipeSummaryBlock.scss';

interface RecipeSummaryBlockProps {
  recipeId: string;
  recipe: RecipeSummary;
}

function RecipeSummaryBlock(props: RecipeSummaryBlockProps) {
  return (
    <li>
      <Link to={`/app/recipe/detail/${props.recipeId}`}>
        <Card>
          <Card.Img variant="top" src={getRecipeImg(props.recipeId, props.recipe.hasImg)} />
          <Card.Body className="recipeName">
            <Card.Title>{props.recipe.name}</Card.Title>
          </Card.Body>
        </Card>
      </Link>
    </li>
  );
}

export default RecipeSummaryBlock;