import React, { Component } from 'react';
import MainService from '../../services/mainService';
import { Recipe } from '../../types/recipes';
import { withParams } from '../../utils';
import Image from 'react-bootstrap/Image';

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
      <div className="col">
        <h1>{this.state.recipe?.summary.name}</h1>
        <div className="col">
          <div className="row">
            <div>
              <Image alt={`Photo de ${this.state.recipe?.summary.name}`} src={process.env.PUBLIC_URL + '/placeholder.jpg'}></Image>
              <div>
                <span>{this.state.recipe?.summary.servings !== undefined ? 
                  `${this.state.recipe?.summary.servings} part${this.state.recipe?.summary.servings > 1 ? 's' : ''}`
                  : ''}</span>
                <span>{this.state.recipe?.summary.prepTime}mn</span>
                <span>{this.state.recipe?.summary.cookingTime}mn</span>
              </div>
            </div>
            <div>
              {this.state.recipe?.ingredients.map((group, i) => 
                <div key={'ingredientGroup_' + i}>
                  {group.ingredientsGroupName !== null ? <h2>{group.ingredientsGroupName}</h2> : ''}
                  <ul>
                    {group.ingredientsList.map((ingredient, j) => <li key={'ingredient_' + i + '_' + j}>
                      {`${ingredient.quantity ?? ''}${ingredient.unit ?? ''} ${ingredient.name}`}
                    </li>)}
                  </ul>
                </div>)}
            </div>
          </div>
          <div>
            <ul>
              {this.state.recipe?.steps.map((step, i) => <li key={'step_' + i}>{step}</li>)}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(RecipeDetail);