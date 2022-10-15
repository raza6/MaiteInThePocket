import React, { Component } from 'react';
import RecipeSummary from '../../components/RecipeSummaryBlock';
import { Button, Form, InputGroup, Col, Stack } from 'react-bootstrap';
import { FiSearch, FiXCircle } from 'react-icons/fi';
import './RecipesList.scss';
import MainService from '../../services/mainService';
import { RecipeSummaryShort } from '../../types/recipes';
import { debounce, getRandomOfList } from '../../utils';

class RecipesList extends Component<{}, { recipes: Array<RecipeSummaryShort>, search: string }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      recipes: [],
      search: '',
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    await this.updateRecipesList();
  }

  updateRecipesListDebounced = debounce(this.updateRecipesList, this);
  handleInput(e: React.FormEvent<HTMLInputElement>) {
    const search = e.currentTarget.value;
    this.setState({ search });
    if (search.length >= 3 || search.length === 0) {
      this.updateRecipesListDebounced();
    }
  }

  async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await this.updateRecipesList();
  }

  async updateRecipesList(): Promise<void> {
    const recipes = await MainService.searchSummary(this.state.search, 0, 10);
    this.setState({ recipes });
  } 

  render() {
    return (
      <Col>
        <h1>Chercher une recette</h1>
        <Form onSubmit={this.handleSubmit}>
          <InputGroup id="searchBarWrapper">
            <Form.Control
              type="text" value={this.state.search} onInput={this.handleInput} maxLength={50}
              placeholder={getRandomOfList(['Lasagne', 'Pot au feu', 'Curry', 'Pizza', 'Navarin', 'Pancake'])}
            />
            <Button variant="outline-secondary" id="recipeSearchInput" type="submit">
              <FiSearch />
            </Button>
          </InputGroup>
        </Form>
        <ul id="recipeListWrapper">
          {
            this.state.recipes.length > 0 ?
              this.state.recipes.map(recipe => 
                <RecipeSummary recipe={recipe.summary} recipeId={recipe.slugId as string} key={recipe.slugId}></RecipeSummary>) :
              <Stack gap={3} id="noRecipeWrapper">
                <FiXCircle size="3em" color="var(--mp-danger)" />
                <span className="mainMessage">Pas de recette correspondante à ce terme</span>
                <span>Précisez votre recherche</span>
              </Stack>
          }
        </ul>
      </Col>
    );
  }
}

export default RecipesList;