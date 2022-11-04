import React, { Component, ReactNode } from 'react';
import MainService from '../../services/mainService';
import { Ingredient, Recipe } from '../../types/recipes';
import { getRecipeImg, withParams } from '../../utils';
import Image from 'react-bootstrap/Image';
import { Col, Row, Stack } from 'react-bootstrap';
import { FiClock, FiEdit } from 'react-icons/fi';
import { AiOutlineFire, AiOutlinePieChart } from 'react-icons/ai';
import { EVolumeUnit } from '../../types/units';
import { Link, Navigate } from 'react-router-dom';
import './recipeDetail.scss';

class RecipeDetail extends Component<{ params: { id: string } }, { recipe: Recipe | undefined, navigate: string | undefined }> {
  constructor(props: { params: { id: string } }) {
    super(props);
    this.state = {
      recipe: undefined,
      navigate: undefined
    };
  }

  async componentDidMount() {
    const { id } = this.props.params;
    const recipe = await MainService.getRecipe(id);
    if (recipe != null) {
      document.title = `${recipe.summary.name} - Maite in the Pocket`;
      this.setState({ recipe });
    } else {
      this.setState({ navigate: '/app/recipe/list' });
    }
  }

  componentWillUnmount() {
    document.title = 'Maite in the Pocket';
  }

  render() {
    return (
      <div id="recipeDetailWrapper">
        {this.state.navigate && <Navigate to={this.state.navigate}/>}
        <h1>{this.state.recipe?.summary.name}</h1>
        <Col>
          <Row>
            <Col id="recipeSummaryDetail">
              <Image 
                alt={`Photo de ${this.state.recipe?.summary.name}`} 
                src={getRecipeImg(this.state.recipe?.slugId, this.state.recipe?.summary.hasImg ?? false)}
              ></Image>
              <Stack direction="horizontal" gap={5} id="recipeSummaryCounterWrapper">
                {this.state.recipe?.summary.servings !== undefined ? 
                  <span>
                    <AiOutlinePieChart />
                    {`${this.state.recipe?.summary.servings} part${this.state.recipe?.summary.servings > 1 ? 's' : ''}`}
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
            <Col id="recipeActionWrapper">
              <Link to={`/app/recipe/edit/${this.state.recipe?.slugId}`}><FiEdit/></Link>
            </Col>
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

  private renderIngredient(ingredient: Ingredient): ReactNode {
    const { quantity, unit, name, optional } = ingredient;
    
    let unitClear = '';
    if (unit !== null) {
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

    const quantifier = `${quantity ?? ''}${unitClear ?? ''}`;
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

export default withParams(RecipeDetail);