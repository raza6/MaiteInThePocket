import React, { Component, ReactNode } from 'react';
import MainService from '../../services/mainService';
import { Ingredient, Recipe } from '../../types/recipes';
import { withParams } from '../../utils';
import Image from 'react-bootstrap/Image';
import './recipeDetail.scss';
import { Col, Row, Stack } from 'react-bootstrap';
import { FiClock } from 'react-icons/fi';
import { AiOutlineFire, AiOutlinePieChart } from 'react-icons/ai';
import { EVolumeUnit } from '../../types/units';

class RecipeDetail extends Component<{ params: { id: string } }, { recipe: Recipe | undefined }> {
  constructor(props: { params: { id: string } }) {
    super(props);
    this.state = {
      recipe: undefined 
    };
  }

  async componentDidMount() {
    const { id } = this.props.params;
    const recipe = await MainService.getRecipe(id);
    this.setState({ recipe });
  }

  render() {
    return (
      <div id="recipeDetailWrapper">
        <h1>{this.state.recipe?.summary.name}</h1>
        <Col>
          <Row>
            <Col id="recipeSummaryDetail">
              <Image alt={`Photo de ${this.state.recipe?.summary.name}`} src={process.env.PUBLIC_URL + '/placeholder.jpg'}></Image>
              <Stack direction="horizontal" gap={5} id="recipeSummaryCounterWrapper">
                <span>
                  <AiOutlinePieChart />
                  {this.state.recipe?.summary.servings !== undefined ? 
                    `${this.state.recipe?.summary.servings} part${this.state.recipe?.summary.servings > 1 ? 's' : ''}`
                    : ''}</span>
                <span><FiClock />{this.state.recipe?.summary.prepTime}mn</span>
                <span><AiOutlineFire />{this.state.recipe?.summary.cookingTime}mn</span>
              </Stack>
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
    const { quantity, unit, name } = ingredient;
    
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
    return `${quantifier}${spacer}${name}`;
  }
}

export default withParams(RecipeDetail);