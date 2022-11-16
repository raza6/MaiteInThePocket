import React, { Component, ReactNode } from 'react';
import MainService from '../../services/mainService';
import { Ingredient, Recipe } from '../../types/recipes';
import { getRecipeImg, withRouter } from '../../utils';
import Image from 'react-bootstrap/Image';
import { Button, Col, Row, Stack } from 'react-bootstrap';
import { FiClock, FiEdit, FiUserMinus, FiUserPlus } from 'react-icons/fi';
import { AiOutlineFire, AiOutlinePieChart } from 'react-icons/ai';
import { EVolumeUnit } from '../../types/units';
import { Link, Navigate } from 'react-router-dom';
import './RecipeDetail.scss';

interface RecipeDetailState { 
  recipe: Recipe | undefined,
  navigate: string | undefined
  currentServings: number,
}

interface RecipeDetailProps { 
  router: {
    params: { id: string }
  }
}

class RecipeDetail extends Component<RecipeDetailProps, RecipeDetailState> {
  constructor(props: RecipeDetailProps) {
    super(props);
    this.state = {
      recipe: undefined,
      navigate: undefined,
      currentServings: 1,
    };

    this.handleAddServing = this.handleAddServing.bind(this);
    this.handleRemoveServing = this.handleRemoveServing.bind(this);
  }

  async componentDidMount() {
    const { id } = this.props.router.params;
    const recipe = await MainService.getRecipe(id);
    if (recipe != null) {
      document.title = `${recipe.summary.name} - Maite in the Pocket`;
      this.setState({ recipe, currentServings: recipe.summary.servings });
    } else {
      this.setState({ navigate: `/app/recipe/detail/${id}/notfound` });
    }
  }

  componentWillUnmount() {
    document.title = 'Maite in the Pocket';
  }

  handleAddServing() {
    this.setState({ currentServings: this.state.currentServings + 1 });
  }

  handleRemoveServing() {
    this.setState({ currentServings: this.state.currentServings - 1 });
  }

  render() {
    return (
      <div id="recipeDetailWrapper">
        {this.state.navigate && <Navigate to={this.state.navigate}/>}
        <h1>{this.state.recipe?.summary.name}</h1>
        <Col>
          <Row id="recipeTopWrapper">
            <Col id="recipeSummaryDetailWrapper">
              <div id="recipeSummaryDetail">
                <Image 
                  alt={`Photo de ${this.state.recipe?.summary.name}`} 
                  src={getRecipeImg(this.state.recipe?.slugId, this.state.recipe?.summary.hasImg ?? false)}
                ></Image>
                <Stack direction="horizontal" gap={5} id="recipeSummaryCounterWrapper">
                  {this.state.recipe?.summary.servings !== undefined ? 
                    <span>
                      <AiOutlinePieChart />
                      {`${this.state.currentServings} part${this.state.currentServings > 1 ? 's' : ''}`}
                    </span>
                    : ''}
                  <span><FiClock />{this.state.recipe?.summary.prepTime}mn</span>
                  <span><AiOutlineFire />{this.state.recipe?.summary.cookingTime}mn</span>
                </Stack>
                {
                  this.state.recipe?.summary.comment &&
                    <span id="recipeSummaryComment">
                      <b>Commentaires :</b> {this.state.recipe?.summary.comment}
                    </span>
                }
              </div>
              {this.renderActions('mobile')}
            </Col>
            <Col id="recipeIngredientsWrapper">
              <h4>Ingrédients :</h4>
              {this.state.recipe?.ingredients.map((group, i) => 
                <div key={'ingredientGroup_' + i}>
                  {group.ingredientsGroupName !== null ? <h5>{group.ingredientsGroupName}</h5> : ''}
                  <ul>
                    {group.ingredientsList.map((ingredient, j) => <li key={'ingredient_' + i + '_' + j}>
                      {this.renderIngredient(ingredient)}
                    </li>)}
                  </ul>
                </div>)}
            </Col>
            {this.renderActions('laptop')}
          </Row>
          <Row id="recipeStepsWrapper">
            <ol>
              {this.state.recipe?.steps.map((step, i) => <li key={'step_' + i}>{step}</li>)}
            </ol>
          </Row>
        </Col>
      </div>
    );
  }

  private renderActions(respMode: string): ReactNode {
    return (
      <Col id="recipeActionWrapper" className={respMode}>
        <Link to={`/app/recipe/edit/${this.state.recipe?.slugId}`}>
          <Button>
            <FiEdit/>
          </Button>
        </Link>
        <Button onClick={this.handleAddServing}>
          <FiUserPlus/>
        </Button>
        <Button onClick={this.handleRemoveServing} disabled={this.state.currentServings === 1}>
          <FiUserMinus/>
        </Button>
      </Col>
    );
  }

  private renderIngredient(ingredient: Ingredient): ReactNode {
    const { quantity, unit, name, optional } = ingredient;
    
    const defaultServings = this.state.recipe?.summary.servings ?? 1;
    const currentServings = this.state.currentServings;
    let adjustedQuantity = quantity;
    let unitClear = '';
    if (quantity) {
      adjustedQuantity = Math.max(Math.round(quantity * (currentServings / defaultServings)), 1);
      
      if (unit) {
        switch (unit) {
        case EVolumeUnit.handfull:
          unitClear = ' poignée';
          break;
        case EVolumeUnit.pinch:
          unitClear = ' pincée';
          break;
        case EVolumeUnit.tablespoon:
          unitClear = ' cuillère à soupe';
          break;
        case EVolumeUnit.teaspoon:
          unitClear = ' cuillère à café';
          break;
        default:
          unitClear = unit.toString();
          break;
        }
      }
    }

    const quantifier = `${adjustedQuantity ?? ''}${unitClear ?? ''}`;
    let spacer = '';
    if (quantity && unit) {
      spacer = ' - ';
    } else if (quantity && !unit) {
      spacer = ' ';
    }
    
    let optionalText = '';
    if (optional) {
      optionalText = ' (facultatif)';
    }

    return `${quantifier}${spacer}${name}${optionalText}`;
  }
}

export default withRouter(RecipeDetail);