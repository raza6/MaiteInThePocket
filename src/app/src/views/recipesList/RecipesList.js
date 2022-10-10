import { Component } from 'react';
import RecipeSummary from '../../components/RecipeSummary';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FiSearch } from "react-icons/fi";
import './RecipesList.scss';
import MainService from '../../services/mainService';

function getRandomOfList (list) {
  return list[Math.floor((Math.random()*list.length))];
}

class RecipesList extends Component {

  constructor(props) {
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
      <div className="col">
        <h1>Chercher une recette</h1>
        <InputGroup id="searchBarWrapper">
          <Form.Control
            placeholder={getRandomOfList(["Lasagne", "Pot au feu", "Curry", "Pizza", "Navarin", "Pancake"])}
          />
          <Button variant="outline-secondary" id="recipeSearchInput">
            <FiSearch />
          </Button>
        </InputGroup>
        <ul id="recipeListWrapper">
          {
            this.state.recipes.map(recipe => 
              <RecipeSummary recipe={recipe.summary} recipeId={recipe.id} key={recipe.id}></RecipeSummary>)
          }
        </ul>
      </div>
    )
  }
}

export default RecipesList;