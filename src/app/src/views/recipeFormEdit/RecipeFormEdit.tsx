import React, { useEffect, useState } from 'react';
import { Row, Col, Stack, Image, Button, Modal, Form, Alert, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { AiOutlineFire, AiOutlinePieChart } from 'react-icons/ai';
import { FiCheckCircle, FiCheckSquare, FiClock, FiHelpCircle, FiImage, FiMove, FiPlusSquare, FiShare, FiTrash2, FiXSquare } from 'react-icons/fi';
import { Navigate, useParams } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';
import RecipeService from '../../services/recipeService';
import { GenProps } from '../../types/generic';
import { Recipe, RecipeSummary, RecipeSummaryEdit, RecipeStepSortable, RecipeIngredientSortable } from '../../types/recipes';
import { ELengthUnit, EMassUnit, EVolumeUnit, EUnit } from '../../types/units';
import { getRecipeImg } from '../../utils';
import './RecipeFormEdit.scss';

enum EModalEdit {
  CancelEdit = 0,
  DeleteRecipe = 1
}

interface RecipeFormEditProps extends GenProps {
  addMode?: boolean
}

function RecipeFormEdit(props: RecipeFormEditProps) {
  // State
  const [recipe, setRecipe] = useState<Recipe<RecipeSummaryEdit> | undefined>(undefined);
  const [recipeStepsSort, setRecipeStepsSort] = useState<Array<RecipeStepSortable>>([]);
  const [recipeIngredientsSort, setRecipeIngredientsSort] = useState<Array<Array<RecipeIngredientSortable>>>([]);
  const [recipeImg, setRecipeImg] = useState<File | undefined>(undefined);
  const [recipeImgUrl, setRecipeImgUrl] = useState<string | undefined>(undefined);
  const [show, setShow] = useState(new Array(2).fill(false));
  const [navigate, setNavigate] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<Array<string>>([]);
  const [addMode, setAddMode] = useState(false);
  const [hasTemp, setHasTemp] = useState(false);
  const [exitWithoutTemp, setExitWithoutTemp] = useState(false);

  // Circumstantial
  const { id: recipeIdInit } = useParams();

  const setRecipeIngredientsSortIdx = (value: RecipeIngredientSortable[], index: number) => {
    const newRecipeIngredientsSort: Array<Array<RecipeIngredientSortable>> = JSON.parse(JSON.stringify(recipeIngredientsSort));
    newRecipeIngredientsSort[index] = value;
    setRecipeIngredientsSort(newRecipeIngredientsSort);
  };

  const handleRecipeChange = (value: string, recipeProperty: Array<string>) => {
    const newRecipe: Recipe<RecipeSummaryEdit> = JSON.parse(JSON.stringify(recipe));
    if (recipeProperty[0] === 'summary') {
      if (recipeProperty[1] === 'name') {
        newRecipe.summary.name = value;
      } else if (recipeProperty[1] === 'servings') {
        let servings = null;
        if (value !== '') {
          servings = parseInt(value, 10);
          if (servings < 1) {
            servings = null;
          }           
        }
        newRecipe.summary.servings = servings;
      } else if (recipeProperty[1] === 'cookingTime') {
        let cookingTime = null;
        if (value !== '') {
          cookingTime = parseInt(value, 10);
          if (cookingTime < 0) {
            cookingTime = null;
          }           
        }
        newRecipe.summary.cookingTime = cookingTime;
      } else if (recipeProperty[1] === 'prepTime') {
        let prepTime = null;
        if (value !== '') {
          prepTime = parseInt(value, 10);
          if (prepTime < 0) {
            prepTime = null;
          }           
        }
        newRecipe.summary.prepTime = prepTime;
      } else if (recipeProperty[1] === 'comment') {
        newRecipe.summary.comment = value !== '' ? value : null;
      }
    } else if (recipeProperty[0] === 'steps') {
      newRecipe.steps[parseInt(recipeProperty[1], 10)] = value;
      recipeStepsSort[parseInt(recipeProperty[1], 10)].value = value;
      setRecipeStepsSort(recipeStepsSort);
    } else if (recipeProperty[0] === 'ingredientsGroupName') {
      newRecipe.ingredients[parseInt(recipeProperty[1], 10)].ingredientsGroupName = value;
    } else if (recipeProperty[0] === 'ingredients') {
      if (recipeProperty[1] === 'quantity') {
        newRecipe.ingredients[parseInt(recipeProperty[2], 10)]
          .ingredientsList[parseInt(recipeProperty[3], 10)].quantity = value !== '' ? parseInt(value, 10) : null;
      } else if (recipeProperty[1] === 'unit') {
        newRecipe.ingredients[parseInt(recipeProperty[2], 10)]
          .ingredientsList[parseInt(recipeProperty[3], 10)].unit = value !== '' ? value as EUnit : null;
      } else if (recipeProperty[1] === 'name') {
        newRecipe.ingredients[parseInt(recipeProperty[2], 10)]
          .ingredientsList[parseInt(recipeProperty[3], 10)].name = value;
      } else if (recipeProperty[1] === 'optional') {
        newRecipe.ingredients[parseInt(recipeProperty[2], 10)]
          .ingredientsList[parseInt(recipeProperty[3], 10)].optional = value === 'true';
      }
      recipeIngredientsSort[parseInt(recipeProperty[2], 10)][parseInt(recipeProperty[3], 10)].value = 
        newRecipe.ingredients[parseInt(recipeProperty[2], 10)].ingredientsList[parseInt(recipeProperty[3], 10)];
      setRecipeIngredientsSort(recipeIngredientsSort);
    }
    setRecipe(newRecipe);
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file !== undefined) {
      if (file.size > 4 * 1024 * 1024) {
        setErrors(['L\'image est trop volumineuse']);
      } else {
        const fileUrl = window.URL.createObjectURL(file);
        setRecipeImg(file);
        setRecipeImgUrl(fileUrl);
      }
    }
  };

  const handleAddStep = () => {
    const newRecipe: Recipe<RecipeSummaryEdit> = JSON.parse(JSON.stringify(recipe));
    newRecipe.steps.push('');
    setRecipe(newRecipe);
    recipeStepsSort.push({ id: Math.random(), value: '' });
    setRecipeStepsSort(recipeStepsSort);
  };

  const handleRemoveStep = (index: number) => {
    const newRecipe: Recipe<RecipeSummaryEdit> = JSON.parse(JSON.stringify(recipe));
    newRecipe.steps.splice(index, 1);
    setRecipe(newRecipe);
    recipeStepsSort.splice(index, 1);
    setRecipeStepsSort(recipeStepsSort);
  };

  const handleAddIngredientGroup = () => {
    const newRecipe: Recipe<RecipeSummaryEdit> = JSON.parse(JSON.stringify(recipe));
    newRecipe.ingredients.push({ ingredientsGroupName: null, ingredientsList: [] });
    setRecipe(newRecipe);
    recipeIngredientsSort.push([]);
    setRecipeIngredientsSort(recipeIngredientsSort);
  };

  const handleRemoveIngredientGroup = (index: number) => {
    const newRecipe: Recipe<RecipeSummaryEdit> = JSON.parse(JSON.stringify(recipe));
    newRecipe.ingredients.splice(index, 1);
    setRecipe(newRecipe);
    recipeIngredientsSort.splice(index, 1);
    setRecipeIngredientsSort(recipeIngredientsSort);
  };

  const handleAddIngredient = (index: number) => {
    const newRecipe: Recipe<RecipeSummaryEdit> = JSON.parse(JSON.stringify(recipe));
    const newIngredient = { name: '', quantity: null, unit: null, optional: false };
    newRecipe.ingredients[index].ingredientsList.push(newIngredient);
    setRecipe(newRecipe);
    const newRecipeIngredientsSort: Array<Array<RecipeIngredientSortable>> = JSON.parse(JSON.stringify(recipeIngredientsSort));
    newRecipeIngredientsSort[index].push({ id: Math.random(), value: newIngredient });
    setRecipeIngredientsSort(newRecipeIngredientsSort);
  };

  const handleRemoveIngredient = (indexGroup: number, indexIngredient: number) => {
    const newRecipe: Recipe<RecipeSummaryEdit> = JSON.parse(JSON.stringify(recipe));
    newRecipe.ingredients[indexGroup].ingredientsList.splice(indexIngredient, 1);
    setRecipe(newRecipe);
    const newRecipeIngredientsSort: Array<Array<RecipeIngredientSortable>> = JSON.parse(JSON.stringify(recipeIngredientsSort));
    newRecipeIngredientsSort[indexGroup].splice(indexIngredient, 1);
    setRecipeIngredientsSort(newRecipeIngredientsSort);
  };

  const handleCloseError = (index: number) => {
    const newErrors = [...errors];
    newErrors.splice(index, 1);
    setErrors(newErrors);
  };

  const handleClose = (currentModal: EModalEdit) => {
    setShow(show.map((v, i) => i === currentModal ? false : v));
  };

  const handleShow = (currentModal: EModalEdit) => {
    setShow(show.map((v, i) => i === currentModal ? true : v));
  };

  const handleSubmit = async () => {
    const errors = validateRecipe();
    if (errors.length === 0 && recipe !== undefined) {
      let recipeId: string | undefined;
      if (addMode) {
        recipeId = await RecipeService.addRecipe(recipe as Recipe<RecipeSummary>);
      } else {
        recipeId = recipe.slugId;
        if (recipeId !== undefined) {
          await RecipeService.editRecipe(recipeId, recipe as Recipe<RecipeSummary>);
        }
      }
      if (recipeImg !== undefined && recipeId !== undefined) {
        const recipeImgClean = recipeImg ?? new File([], '');
        await RecipeService.addImgRecipe(recipeId, recipeImgClean);
      }
      setTimeout(() => {
        setNavigate(`/app/recipe/detail/${recipeId}`);
        setExitWithoutTemp(true);
      }, 1000);
    } else {
      setErrors(errors);
    }
  };

  const handleCancel = () => {
    const redirectUrl = addMode ? '/app/recipe/list' : `/app/recipe/detail/${recipe?.slugId}`;
    setNavigate(redirectUrl);
    setExitWithoutTemp(true);
  };

  const handleDelete = async () => {
    await RecipeService.deleteRecipe(recipe?.slugId ?? '');
    setNavigate('/app/recipe/list');
  };

  const handleTempImport = () => {
    const recipe: Recipe<RecipeSummaryEdit> = JSON.parse(localStorage.getItem('maite_recipe_temp') ?? '');
    localStorage.removeItem('maite_recipe_temp');
    setRecipe(recipe);
    setHasTemp(false);
  };

  const initRecipeForm = async () => {
    const addMode = props.addMode ?? false;
    if (addMode) {
      const recipe = defaultRecipe();
      const hasTemp = localStorage.getItem('maite_recipe_temp') !== null;
      setRecipe(recipe);
      setRecipeStepsSort(recipe.steps.map(s => { return { id: Math.random(), value: s }; }));
      setRecipeIngredientsSort(recipe.ingredients.map(g => g.ingredientsList.map(ing => { return { id: Math.random(), value: ing }; })));
      setAddMode(addMode);
      setHasTemp(hasTemp);
    } else {
      if (recipeIdInit !== undefined) {
        const recipe = await RecipeService.getRecipe(recipeIdInit);
        if (recipe !== null) {
          setRecipe(recipe);
          setRecipeStepsSort(recipe.steps.map(s => { return { id: Math.random(), value: s }; }));
          setRecipeIngredientsSort(recipe.ingredients.map(g => g.ingredientsList.map(ing => { return { id: Math.random(), value: ing }; })));
          setAddMode(addMode);
        } else {
          setNavigate(`/app/recipe/edit/${recipeIdInit}/notfound`);
        }
      } else {
        setNavigate('/app/recipe/edit/undef/notfound');
      }
    }
  };

  useEffect(() => {
    initRecipeForm();
    props.pageName(addMode ? 'Ajouter' : 'Modifier');

    return () => {
      if (addMode && exitWithoutTemp) {
        localStorage.removeItem('maite_recipe_temp');
      }
    };
  }, []);

  useEffect(() => {
    if (addMode) {
      const newRecipe = JSON.stringify(recipe);
  
      if (newRecipe !== JSON.stringify(defaultRecipe())) {
        localStorage.setItem('maite_recipe_temp', newRecipe);
      }
    }
  });

  useEffect(() => {
    if (recipe !== undefined) {
      const newRecipe: Recipe<RecipeSummaryEdit> = JSON.parse(JSON.stringify(recipe));
      newRecipe.steps = recipeStepsSort.map(rs => rs.value);
      setRecipe(newRecipe);
    }
  }, [recipeStepsSort]);

  useEffect(() => { 
    if (recipe !== undefined) {
      const newRecipe: Recipe<RecipeSummaryEdit> = JSON.parse(JSON.stringify(recipe));
      for (let i = 0; i < recipeIngredientsSort.length; i++) {
        newRecipe.ingredients[i].ingredientsList = recipeIngredientsSort[i].map(ing => ing.value);
      }
      setRecipe(newRecipe);
    }
  }, [recipeIngredientsSort]);

  const validateRecipe = () => {
    const errors = [];
    if (!recipe?.summary.name.trim()) {
      errors.push('Le nom de la recette n\'est pas renseigné');
    }
    if (recipe?.summary.servings == null) {
      errors.push('Le nombre de couverts n\'est pas renseigné');
    }
    if (recipe?.summary.prepTime == null) {
      errors.push('Le temps de préparation n\'est pas renseigné');
    }
    if (recipe?.summary.cookingTime == null) {
      errors.push('Le temps de cuisson n\'est pas renseigné');
    }
    if (recipe?.ingredients.length === 0) {
      errors.push('La recette n\'a pas d\'ingrédient');
    } else if (recipe !== undefined) {
      if (recipe.ingredients.length > 1 && recipe.ingredients.some(group => !group.ingredientsGroupName?.trim())) {
        errors.push('La recette a des groupes d\'ingrédients non-nommés');
      }
      if (recipe.ingredients.flatMap(group => group.ingredientsList).length === 0) {
        errors.push('La recette n\'a pas d\'ingrédient');
      } else {
        const allIngredients = recipe.ingredients.flatMap(group => group.ingredientsList);
        if (allIngredients.some(ingr => !ingr.name.trim())) {
          errors.push('La recette a des ingrédients non-nommés');
        }
        if (allIngredients.some(ingr => ingr.unit != null && ingr.quantity == null)) {
          errors.push('La recette a des ingrédients mesurés sans quantité');
        }
      }
    }
    if (recipe?.steps.length === 0) {
      errors.push('La recette n\'a pas d\'instruction');
    } else {
      if (recipe?.steps.some(step => !step.trim())) {
        errors.push('La recette a des instructions non-renseignées');
      }
    }
    return errors;
  };

  const defaultRecipe = () => {
    return {
      slugId: undefined,
      summary: {
        name: '',
        servings: 1,
        prepTime: 0,
        cookingTime: 0,
        comment: null,
        hasImg: false
      },
      ingredients: [
        {
          ingredientsGroupName: null,
          ingredientsList: [
            {
              name: '',
              quantity: null,
              unit: null,
              optional: false
            }
          ]
        }
      ],
      steps: ['']
    };
  };

  return (
    <Col id="recipeEditWrapper">
      {navigate && <Navigate to={navigate}/>}
      {errors.map((error, i) => <Alert dismissible key={`alert_${i}`} variant="danger" onClose={() => handleCloseError(i)}>
        {error}
      </Alert>)}
      <h1 className="laptop">{addMode ? 'Ajouter' : 'Modifier'} une recette</h1>
      <Stack id="recipeEditActionWrapper" direction="horizontal" gap={3}>
        <Button variant="success" onClick={handleSubmit}><FiCheckSquare /></Button>
        <Button variant="warning" onClick={() => handleShow(EModalEdit.CancelEdit)}><FiXSquare /></Button>
        {!addMode && <Button variant="danger" onClick={() => handleShow(EModalEdit.DeleteRecipe)}><FiTrash2 /></Button>}
        {hasTemp &&  
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Restaurer</Tooltip>}
          >
            <div id="recipeRecoverWrapper">
              <FiShare onClick={handleTempImport} />
            </div>
          </OverlayTrigger>
        }
      </Stack>
      <Form>
        <Row>
          <Col id="recipeSummaryDetail">
            <Form.Control type="text" required id="recipeNameInput"
              value={recipe?.summary.name ?? ''} minLength={1} maxLength={50} 
              onChange={(e) => handleRecipeChange(e.currentTarget.value, ['summary', 'name'])}
            ></Form.Control>
            <Stack direction="horizontal" gap={3} id="recipeImageInputWrapper">
              <Image 
                alt={`Photo de ${recipe?.summary.name}`}
                src={
                  recipeImg !== undefined
                    ? recipeImgUrl
                    : getRecipeImg(recipe?.slugId, recipe?.summary.hasImg ?? false)
                }
              ></Image>
              <Button variant="primary" id="recipeImgButton">
                <label htmlFor="recipeImgInput">
                  <FiImage />
                </label>
                <input type="file" accept=".jpeg,.jpg,.png,image/jpeg,image/png" name="img" id="recipeImgInput" onChange={handleImgChange}></input>
              </Button>
            </Stack>
            <Stack direction="horizontal" gap={4} id="recipeSummaryCounterWrapper"> 
              <span>
                <AiOutlinePieChart />
                <Form.Control size="sm" type="number" required id="recipeServingsInput"
                  value={recipe?.summary.servings ?? ''} min="1" 
                  onChange={(e) => handleRecipeChange(e.currentTarget.value, ['summary', 'servings'])}
                ></Form.Control>
                {` part${(recipe?.summary.servings ?? 1) > 1 ? 's' : ''}`}
              </span>
              <span>
                <FiClock />
                <Form.Control size="sm" type="number" required id="recipePreptimeInput"
                  value={recipe?.summary.prepTime ?? ''} min="0" 
                  onChange={(e) => handleRecipeChange(e.currentTarget.value, ['summary', 'prepTime'])}
                ></Form.Control>mn
              </span>
              <span>
                <AiOutlineFire />
                <Form.Control size="sm" type="number" required id="recipeCookingtimeInput"
                  value={recipe?.summary.cookingTime ?? ''} min="0" 
                  onChange={(e) => handleRecipeChange(e.currentTarget.value, ['summary', 'cookingTime'])}
                ></Form.Control>mn
              </span>
            </Stack>
            <Stack id="recipeSummaryCommentWrapper">
              <Form.Label htmlFor="recipeSummaryComment">Commentaire</Form.Label>
              <Form.Control as="textarea" rows={2} id="recipeSummaryComment" value={recipe?.summary.comment ?? ''}
                onChange={(e) => handleRecipeChange(e.currentTarget.value, ['summary', 'comment'])}
              ></Form.Control>
            </Stack>
          </Col>
          <Col id="recipeIngredientsWrapper">
            <h4>Ingrédients :</h4>
            {recipe?.ingredients.map((group, i) => 
              <div className="ingredientGroupWrapper" key={'ingredientGroup_' + i}>
                <div className="ingredientGroupInputWrapper">
                  <Form.Control value={group.ingredientsGroupName ?? ''} className="ingredientGroupInput"
                    onChange={(e) => handleRecipeChange(e.currentTarget.value, ['ingredientsGroupName', i.toString()])}
                  ></Form.Control>
                  <Button variant="primary" onClick={() => handleRemoveIngredientGroup(i)}><FiTrash2 /></Button>
                </div>
                <ReactSortable tag="ul" animation={150} list={recipeIngredientsSort[i]} setList={(v) => setRecipeIngredientsSortIdx(v, i)} handle=".recipeHandle">
                  {group.ingredientsList.map((ingredient, j) => <li key={'ingredient_' + i + '_' + j}>
                    <Stack direction="vertical" gap={1}>
                      <Stack direction="horizontal" gap={1}>
                        <Form.Control value={ingredient.name} 
                          onChange={(e) => handleRecipeChange(e.currentTarget.value, ['ingredients', 'name', i.toString(), j.toString()])}
                        ></Form.Control>
                        <Button variant="primary" className="recipeHandle"><FiMove /></Button>
                      </Stack>
                      <Stack direction="horizontal" gap={1}>
                        <Form.Control type="number" value={ingredient.quantity ?? ''} min={0} className="ingredientQuantityInput"
                          onChange={(e) => handleRecipeChange(e.currentTarget.value, ['ingredients', 'quantity', i.toString(), j.toString()])}
                        ></Form.Control>
                        <Form.Select value={ingredient.unit ?? ''} className="ingredientUnitInput" 
                          onChange={(e) => handleRecipeChange(e.currentTarget.value, ['ingredients', 'unit', i.toString(), j.toString()])}
                        >
                          <option value=''></option>
                          <option value={EMassUnit.g}>g</option>
                          <option value={EMassUnit.kg}>kg</option>
                          <option value={EVolumeUnit.teaspoon}>c.à.c</option>
                          <option value={EVolumeUnit.tablespoon}>c.à.s</option>
                          <option value={EVolumeUnit.handfull}>poignée</option>
                          <option value={EVolumeUnit.pinch}>pincée</option>
                          <option value={EVolumeUnit.ml}>ml</option>
                          <option value={EVolumeUnit.cl}>cl</option>
                          <option value={EVolumeUnit.dl}>dl</option>
                          <option value={EVolumeUnit.l}>l</option>
                          <option value={ELengthUnit.mm}>mm</option>
                          <option value={ELengthUnit.cm}>cm</option>
                          <option value={ELengthUnit.m}>m</option>
                        </Form.Select>
                        <div className="ingredientOptionalInput" onClick={() => handleRecipeChange((!ingredient.optional).toString(), ['ingredients', 'optional', i.toString(), j.toString()])}>
                          {ingredient.optional ? <span><FiHelpCircle /> Facultatif</span> : <span><FiCheckCircle /> Non facultatif</span>}
                        </div>
                        <Button className="ingredientDeleteButton" variant="primary" onClick={() => handleRemoveIngredient(i, j)}><FiTrash2 /></Button>
                      </Stack>
                    </Stack>
                  </li>)}
                  <div className="ingredientAddWrapper">
                    <Button variant="primary" onClick={() => handleAddIngredient(i)}><FiPlusSquare /> Ingrédient</Button>
                  </div>
                </ReactSortable>
              </div>)}
            <Button variant="primary" onClick={handleAddIngredientGroup}><FiPlusSquare /> Groupe d&apos;ingrédient</Button>
          </Col>
        </Row>
        <Row>
          <Col id="recipeStepsWrapper">
            <h4>Étapes :</h4>
            <ReactSortable tag="ol" animation={150} list={recipeStepsSort} setList={setRecipeStepsSort} handle=".stepHandle">
              {recipeStepsSort.map((step, i) => (

                <li key={step.id}>
                  <div className="recipeStepWrapper">
                    <Form.Control as="textarea" rows={2} value={step.value}
                      onChange={(e) => handleRecipeChange(e.currentTarget.value, ['steps', i.toString()])}
                    />
                    <div className="stepActionWrapper">
                      <Button variant="primary" className="stepHandle"><FiMove /></Button>
                      <Button variant="primary" onClick={() => handleRemoveStep(i)}><FiTrash2 /></Button>
                    </div>
                  </div>
                </li>
                
              ))}
            </ReactSortable>
            <Button variant="primary" onClick={handleAddStep}><FiPlusSquare /> Étape</Button>
          </Col>
        </Row>
      </Form>

      <Modal show={show[EModalEdit.CancelEdit]} onHide={() => handleClose(EModalEdit.CancelEdit)}>
        <Modal.Header>
          <Modal.Title>Annuler les modifications ?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose(EModalEdit.CancelEdit)}>
            Non, retour
          </Button>
          <Button variant="warning" onClick={handleCancel}>
            Oui, continuer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show[EModalEdit.DeleteRecipe]} onHide={() => handleClose(EModalEdit.DeleteRecipe)}>
        <Modal.Header>
          <Modal.Title>Supprimer la recette ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>La suppression est définitive</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose(EModalEdit.DeleteRecipe)}>
            Non, retour
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Oui, continuer
          </Button>
        </Modal.Footer>
      </Modal>
    </Col>
  );
}

export default RecipeFormEdit;