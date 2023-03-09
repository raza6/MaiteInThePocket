import React, { ReactNode, useContext, useEffect, useState } from 'react';
import RecipeService from '../../services/recipeService';
import { Ingredient, Recipe, RecipeSummary } from '../../types/recipes';
import { getRecipeImg } from '../../utils';
import Image from 'react-bootstrap/Image';
import { Button, Col, Row, Stack } from 'react-bootstrap';
import { FiClock, FiEdit, FiUserMinus, FiUserPlus } from 'react-icons/fi';
import { AiOutlineFire, AiOutlinePieChart } from 'react-icons/ai';
import { EVolumeUnit } from '../../types/units';
import { Link, Navigate, useParams } from 'react-router-dom';
import AuthContext from '../../components/AuthContext';
import './RecipeDetail.scss';

function RecipeDetail() {
  // State
  const [recipe, setRecipe] = useState<Recipe<RecipeSummary> | undefined>(undefined);
  const [navigate, setNavigate] = useState<string | undefined>(undefined);
  const [currentServings, setCurrentServings] = useState(1);

  // Circumstancial
  const loggedIn = useContext(AuthContext);
  const { id: recipeIdInit } = useParams();
  
  const initRecipe = async () => {
    if (recipeIdInit !== undefined) {
      const recipe = await RecipeService.getRecipe(recipeIdInit);
      if (recipe != null) {
        document.title = `${recipe.summary.name} - Maite in the Pocket`;
        setRecipe(recipe);
        setCurrentServings(recipe.summary.servings);
      } else {
        setNavigate(`/app/recipe/detail/${recipeIdInit}/notfound`);
      }
    } else {
      setNavigate('/app/recipe/detail/undef/notfound');
    }
  };

  useEffect(() => {
    initRecipe();

    return () => {
      document.title = 'Maite in the Pocket';
    };
  }, []);

  const handleAddServing = () => {
    setCurrentServings(currentServings + 1);
  };

  const handleRemoveServing = () => {
    setCurrentServings(currentServings - 1);
  };

  const renderActions = (respMode: string): ReactNode => {
    return (
      <Col id="recipeActionWrapper" className={respMode}>
        {
          loggedIn &&
          <Link to={`/app/recipe/edit/${recipe?.slugId}`}>
            <Button>
              <FiEdit/>
            </Button>
          </Link>
        }
        <Button onClick={handleAddServing}>
          <FiUserPlus/>
        </Button>
        <Button onClick={handleRemoveServing} disabled={currentServings === 1}>
          <FiUserMinus/>
        </Button>
      </Col>
    );
  };

  const renderIngredient = (ingredient: Ingredient): ReactNode => {
    const { quantity, unit, name, optional } = ingredient;
    
    const defaultServings = recipe?.summary.servings ?? 1;
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
  };

  return (
    <div id="recipeDetailWrapper">
      {navigate && <Navigate to={navigate}/>}
      <h1>{recipe?.summary.name}</h1>
      <Col>
        <Row id="recipeTopWrapper">
          <Col id="recipeSummaryDetailWrapper">
            <div id="recipeSummaryDetail">
              <Image 
                alt={`Photo de ${recipe?.summary.name}`} 
                src={getRecipeImg(recipe?.slugId, recipe?.summary.hasImg ?? false)}
              ></Image>
              <Stack direction="horizontal" gap={5} id="recipeSummaryCounterWrapper">
                {recipe?.summary.servings !== undefined ? 
                  <span>
                    <AiOutlinePieChart />
                    {`${currentServings} part${currentServings > 1 ? 's' : ''}`}
                  </span>
                  : ''}
                <span><FiClock />{recipe?.summary.prepTime}mn</span>
                <span><AiOutlineFire />{recipe?.summary.cookingTime}mn</span>
              </Stack>
              {
                recipe?.summary.comment &&
                  <span id="recipeSummaryComment">
                    <b>Commentaires :</b> {recipe?.summary.comment}
                  </span>
              }
            </div>
            {renderActions('mobile')}
          </Col>
          <Col id="recipeIngredientsWrapper">
            <h4>Ingrédients :</h4>
            {recipe?.ingredients.map((group, i) => 
              <div key={'ingredientGroup_' + i}>
                {group.ingredientsGroupName !== null ? <h5>{group.ingredientsGroupName}</h5> : ''}
                <ul>
                  {group.ingredientsList.map((ingredient, j) => <li key={'ingredient_' + i + '_' + j}>
                    {renderIngredient(ingredient)}
                  </li>)}
                </ul>
              </div>)}
          </Col>
          {renderActions('laptop')}
        </Row>
        <Row id="recipeStepsWrapper">
          <ol>
            {recipe?.steps.map((step, i) => <li key={'step_' + i}>{step}</li>)}
          </ol>
        </Row>
      </Col>
    </div>
  );
}

export default RecipeDetail;