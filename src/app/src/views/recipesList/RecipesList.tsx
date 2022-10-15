import React, { Component } from 'react';
import RecipeSummary from '../../components/RecipeSummaryBlock';
import { Button, Form, InputGroup, Col } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import './RecipesList.scss';
import MainService from '../../services/mainService';
import { RecipeSummaryShort } from '../../types/recipes';
import { getRandomOfList } from '../../utils';

class RecipesList extends Component<{}, { recipes: Array<RecipeSummaryShort> }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      recipes: [] 
    };
  }

  async componentDidMount() {
    const recipes = await MainService.searchSummary('', 0, 10);
    this.setState({ recipes });
  }

  render() {
    return (
      <Col>
        <h1>Chercher une recette</h1>
        <InputGroup id="searchBarWrapper">
          <Form.Control
            placeholder={getRandomOfList(['Lasagne', 'Pot au feu', 'Curry', 'Pizza', 'Navarin', 'Pancake'])}
          />
          <Button variant="outline-secondary" id="recipeSearchInput">
            <FiSearch />
          </Button>
        </InputGroup>
        <ul id="recipeListWrapper">
          {
            this.state.recipes.map(recipe => 
              <RecipeSummary recipe={recipe.summary} recipeId={recipe.slugId as string} key={recipe.slugId}></RecipeSummary>)
          }
        </ul>
      </Col>
    );
  }
}

export default RecipesList;