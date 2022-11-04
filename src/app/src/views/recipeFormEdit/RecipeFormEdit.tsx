import React, { Component } from 'react';
import { Row, Col, Stack, Image, Button, Modal, Form, Alert, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { AiOutlineFire, AiOutlinePieChart } from 'react-icons/ai';
import { FiCheckCircle, FiCheckSquare, FiClock, FiHelpCircle, FiImage, FiPlusSquare, FiTrash2, FiXSquare } from 'react-icons/fi';
import { Navigate } from 'react-router-dom';
import MainService from '../../services/mainService';
import { Recipe } from '../../types/recipes';
import { ELengthUnit, EMassUnit, EVolumeUnit, EUnit } from '../../types/units';
import { getRecipeImg, withParams } from '../../utils';
import './RecipeFormEdit.scss';

enum EModalEdit {
  CancelEdit = 0,
  DeleteRecipe = 1
}

interface RecipeFormEditState {
  recipe: Recipe | undefined,
  recipeImg: File | undefined,
  recipeImgUrl: string | undefined,
  show: Array<boolean>,
  currentModal: EModalEdit | undefined,
  navigate: string | undefined,
  errors: Array<string>
}

class RecipeFormEdit extends Component<{ params: { id: string } }, RecipeFormEditState> {  
  constructor(props: { params: { id: string } }) {
    super(props);
    this.state = {
      recipe: undefined,
      recipeImg: undefined,
      recipeImgUrl: undefined,
      show: new Array(2).fill(false),
      currentModal: undefined,
      navigate: undefined,
      errors: []
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleAddStep = this.handleAddStep.bind(this);
    this.handleRemoveStep = this.handleRemoveStep.bind(this);
    this.handleCloseError = this.handleCloseError.bind(this);
    this.handleAddIngredientGroup = this.handleAddIngredientGroup.bind(this);
    this.handleAddIngredient = this.handleAddIngredient.bind(this);
    this.handleRemoveIngredientGroup = this.handleRemoveIngredientGroup.bind(this);
    this.handleRemoveIngredient = this.handleRemoveIngredient.bind(this);
  }

  handleRecipeChange(value: string, recipeProperty: Array<string>) {
    const newRecipe: Recipe = JSON.parse(JSON.stringify(this.state.recipe));
    if (recipeProperty[0] === 'summary') {
      if (recipeProperty[1] === 'name') {
        newRecipe.summary.name = value.trim();
      } else if (recipeProperty[1] === 'servings') {
        newRecipe.summary.servings = value !== '' ? parseInt(value, 10) : 0;
      } else if (recipeProperty[1] === 'cookingTime') {
        newRecipe.summary.cookingTime = value !== '' ? parseInt(value, 10) : 0;
      } else if (recipeProperty[1] === 'prepTime') {
        newRecipe.summary.prepTime = value !== '' ? parseInt(value, 10) : 0;
      } else if (recipeProperty[1] === 'comment') {
        newRecipe.summary.comment = value !== '' ? value.trim() : null;
      }
    } else if (recipeProperty[0] === 'steps') {
      newRecipe.steps[parseInt(recipeProperty[1], 10)] = value.trim();
    } else if (recipeProperty[0] === 'ingredientsGroupName') {
      newRecipe.ingredients[parseInt(recipeProperty[1], 10)].ingredientsGroupName = value.trim();
    } else if (recipeProperty[0] === 'ingredients') {
      if (recipeProperty[1] === 'quantity') {
        newRecipe.ingredients[parseInt(recipeProperty[2], 10)]
          .ingredientsList[parseInt(recipeProperty[3], 10)].quantity = value !== '' ? parseInt(value, 10) : null;
      } else if (recipeProperty[1] === 'unit') {
        newRecipe.ingredients[parseInt(recipeProperty[2], 10)]
          .ingredientsList[parseInt(recipeProperty[3], 10)].unit = value !== '' ? value as EUnit : null;
      } else if (recipeProperty[1] === 'name') {
        newRecipe.ingredients[parseInt(recipeProperty[2], 10)]
          .ingredientsList[parseInt(recipeProperty[3], 10)].name = value.trim();
      } else if (recipeProperty[1] === 'optional') {
        newRecipe.ingredients[parseInt(recipeProperty[2], 10)]
          .ingredientsList[parseInt(recipeProperty[3], 10)].optional = value === 'true';
      }
    }
    this.setState({ recipe: newRecipe });
  }

  handleImgChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file !== undefined) {
      if (file.size > 4 * 1024 * 1024) {
        this.setState({ errors: ['L\'image est trop volumineuse'] });
      } else {
        const fileUrl = window.URL.createObjectURL(file);
        this.setState({ recipeImg: file, recipeImgUrl: fileUrl });
      }
    }
  }

  handleAddStep() {
    const newRecipe: Recipe = JSON.parse(JSON.stringify(this.state.recipe));
    newRecipe.steps.push('');
    this.setState({ recipe: newRecipe });
  }

  handleRemoveStep(index: number) {
    const newRecipe: Recipe = JSON.parse(JSON.stringify(this.state.recipe));
    newRecipe.steps.splice(index, 1);
    this.setState({ recipe: newRecipe });
  }

  handleAddIngredientGroup() {
    const newRecipe: Recipe = JSON.parse(JSON.stringify(this.state.recipe));
    newRecipe.ingredients.push({ ingredientsGroupName: null, ingredientsList: [] });
    this.setState({ recipe: newRecipe });
  }

  handleRemoveIngredientGroup(index: number) {
    const newRecipe: Recipe = JSON.parse(JSON.stringify(this.state.recipe));
    newRecipe.ingredients.splice(index, 1);
    this.setState({ recipe: newRecipe });
  }

  handleAddIngredient(index: number) {
    const newRecipe: Recipe = JSON.parse(JSON.stringify(this.state.recipe));
    newRecipe.ingredients[index].ingredientsList.push({ name: '', quantity: null, unit: null, optional: false });
    this.setState({ recipe: newRecipe });
  }

  handleRemoveIngredient(indexGroup: number, indexIngredient: number) {
    const newRecipe: Recipe = JSON.parse(JSON.stringify(this.state.recipe));
    newRecipe.ingredients[indexGroup].ingredientsList.splice(indexIngredient, 1);
    this.setState({ recipe: newRecipe });
  }

  handleCloseError(index: number) {
    const newErrors = [...this.state.errors];
    newErrors.splice(index, 1);
    this.setState({ errors: newErrors });
  }

  handleClose(currentModal: EModalEdit) {
    this.setState({ show: this.state.show.map((v, i) => i === currentModal ? false : v) });
  }

  handleShow(currentModal: EModalEdit) {
    this.setState({ show: this.state.show.map((v, i) => i === currentModal ? true : v) });
  }

  async handleSubmit() {
    const errors = this.validateRecipe();
    if (errors.length === 0 && this.state.recipe !== undefined) {
      const recipeId = this.state.recipe.slugId ?? '';
      const recipe = this.state.recipe;
      if (this.state.recipeImg !== undefined) {
        const recipeImg = this.state.recipeImg ?? new File([], '');
        await MainService.addImgRecipe(recipeId, recipeImg);
      }
      await MainService.editRecipe(recipeId, recipe);
      setTimeout(() => {
        this.setState({ navigate: `/app/recipe/detail/${this.state.recipe?.slugId}` });
      }, 300);
    } else {
      this.setState({ errors: errors });
    }
  }

  handleCancel() {
    this.setState({ navigate: `/app/recipe/detail/${this.state.recipe?.slugId}` });
  }

  handleDelete() {
    //await delete call
    this.setState({ navigate: '/app/recipe/list' });
  }

  async componentDidMount() {
    const { id } = this.props.params;
    const recipe = await MainService.getRecipe(id);
    if (recipe !== null) {
      this.setState({ recipe });
    } else {
      this.setState({ navigate: '/app/recipe/list' });
    }
  }

  validateRecipe() {
    const errors = [];
    const recipe = this.state.recipe;
    if (!recipe?.summary.name) {
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
      if (recipe.ingredients.length > 1 && recipe.ingredients.some(group => !group.ingredientsGroupName)) {
        errors.push('La recette a des groupes d\'ingrédients non-nommés');
      }
      if (recipe.ingredients.flatMap(group => group.ingredientsList).length === 0) {
        errors.push('La recette n\'a pas d\'ingrédient');
      } else {
        const allIngredients = recipe.ingredients.flatMap(group => group.ingredientsList);
        if (allIngredients.some(ingr => !ingr.name)) {
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
      if (recipe?.steps.some(step => !step)) {
        errors.push('La recette a des instructions non-renseignées');
      }
    }
    return errors;
  }

  render() {
    return (
      <Col id="recipeEditWrapper">
        {this.state.navigate && <Navigate to={this.state.navigate}/>}
        {this.state.errors.map((error, i) => <Alert dismissible key={`alert_${i}`} variant="danger" onClose={() => this.handleCloseError(i)}>
          {error}
        </Alert>)}
        <h1>Modifier une recette</h1>
        <Stack id="recipeEditActionWrapper" direction="horizontal" gap={3}>
          <Button variant="success" onClick={this.handleSubmit}><FiCheckSquare /></Button>
          <Button variant="warning" onClick={() => this.handleShow(EModalEdit.CancelEdit)}><FiXSquare /></Button>
          <Button variant="danger" onClick={() => this.handleShow(EModalEdit.DeleteRecipe)}><FiTrash2 /></Button>
        </Stack>
        <Form>
          <Row>
            <Col id="recipeSummaryDetail">
              <Form.Control type="text" required id="recipeNameInput"
                value={this.state.recipe?.summary.name ?? ''} minLength={1} maxLength={50} 
                onChange={(e) => this.handleRecipeChange(e.currentTarget.value, ['summary', 'name'])}
              ></Form.Control>
              <Stack direction="horizontal" gap={3} id="recipeImageInputWrapper">
                <Image 
                  alt={`Photo de ${this.state.recipe?.summary.name}`}
                  src={
                    this.state.recipeImg !== undefined
                      ? this.state.recipeImgUrl
                      : getRecipeImg(this.state.recipe?.slugId, this.state.recipe?.summary.hasImg ?? false)
                  }
                ></Image>
                <Button variant="primary" id="recipeImgButton">
                  <label htmlFor="recipeImgInput">
                    <FiImage />
                  </label>
                  <input type="file" accept=".jpeg,.jpg,.png,image/jpeg,image/png" name="img" id="recipeImgInput" onChange={this.handleImgChange}></input>
                </Button>
              </Stack>
              <Stack direction="horizontal" gap={4} id="recipeSummaryCounterWrapper"> 
                <span>
                  <AiOutlinePieChart />
                  <Form.Control size="sm" type="number" required id="recipeServingsInput"
                    value={this.state.recipe?.summary.servings ?? 1} min="1" 
                    onChange={(e) => this.handleRecipeChange(e.currentTarget.value, ['summary', 'servings'])}
                  ></Form.Control>
                  {` part${(this.state.recipe?.summary.servings ?? 1) > 1 ? 's' : ''}`}
                </span>
                <span>
                  <FiClock />
                  <Form.Control size="sm" type="number" required id="recipePreptimeInput"
                    value={this.state.recipe?.summary.prepTime ?? 0} min="0" 
                    onChange={(e) => this.handleRecipeChange(e.currentTarget.value, ['summary', 'prepTime'])}
                  ></Form.Control>mn
                </span>
                <span>
                  <AiOutlineFire />
                  <Form.Control size="sm" type="number" required id="recipeCookingtimeInput"
                    value={this.state.recipe?.summary.cookingTime ?? 0} min="0" 
                    onChange={(e) => this.handleRecipeChange(e.currentTarget.value, ['summary', 'cookingTime'])}
                  ></Form.Control>mn
                </span>
              </Stack>
              <Stack id="recipeSummaryCommentWrapper">
                <Form.Label htmlFor="recipeSummaryComment">Commentaire</Form.Label>
                <Form.Control as="textarea" rows={2} id="recipeSummaryComment" value={this.state.recipe?.summary.comment ?? ''}
                  onChange={(e) => this.handleRecipeChange(e.currentTarget.value, ['summary', 'comment'])}
                ></Form.Control>
              </Stack>
            </Col>
            <Col id="recipeIngredientsWrapper">
              <h4>Ingrédients :</h4>
              {this.state.recipe?.ingredients.map((group, i) => 
                <div className="ingredientGroupWrapper" key={'ingredientGroup_' + i}>
                  <div className="ingredientGroupInputWrapper">
                    <Form.Control value={group.ingredientsGroupName ?? ''} className="ingredientGroupInput"
                      onChange={(e) => this.handleRecipeChange(e.currentTarget.value, ['ingredientsGroupName', i.toString()])}
                    ></Form.Control>
                    <Button variant="primary" onClick={() => this.handleRemoveIngredientGroup(i)}><FiTrash2 /></Button>
                  </div>
                  <ul>
                    {group.ingredientsList.map((ingredient, j) => <li key={'ingredient_' + i + '_' + j}>
                      <Stack direction="horizontal" gap={1}>
                        <Form.Control type="number" value={ingredient.quantity ?? ''} min={0} className="ingredientQuantityInput"
                          onChange={(e) => this.handleRecipeChange(e.currentTarget.value, ['ingredients', 'quantity', i.toString(), j.toString()])}
                        ></Form.Control>
                        <Form.Select value={ingredient.unit ?? ''} className="ingredientUnitInput" 
                          onChange={(e) => this.handleRecipeChange(e.currentTarget.value, ['ingredients', 'unit', i.toString(), j.toString()])}
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
                        <Form.Control value={ingredient.name} 
                          onChange={(e) => this.handleRecipeChange(e.currentTarget.value, ['ingredients', 'name', i.toString(), j.toString()])}
                        ></Form.Control>
                        <OverlayTrigger
                          placement="left"
                          overlay={
                            <Tooltip>
                              {ingredient.optional ? 'Facultatif' : 'Non facultatif'}
                            </Tooltip>
                          }
                        >
                          <div className="ingredientOptionalInput" onClick={() => this.handleRecipeChange((!ingredient.optional).toString(), ['ingredients', 'optional', i.toString(), j.toString()])}>
                            {ingredient.optional ? <FiHelpCircle /> : <FiCheckCircle />}
                          </div>
                        </OverlayTrigger>
                        <Button variant="primary" onClick={() => this.handleRemoveIngredient(i, j)}><FiTrash2 /></Button>
                      </Stack>
                    </li>)}
                    <div className="ingredientAddWrapper">
                      <Button variant="primary" onClick={() => this.handleAddIngredient(i)}><FiPlusSquare /> Ingrédient</Button>
                    </div>
                  </ul>
                </div>)}
              <Button variant="primary" onClick={this.handleAddIngredientGroup}><FiPlusSquare /> Groupe</Button>
            </Col>
          </Row>
          <Row>
            <Col id="recipeStepsWrapper">
              <ol>
                {this.state.recipe?.steps.map((step, i) => <li key={'step_' + i}>
                  <div className="recipeStepWrapper">
                    <Form.Control as="textarea" rows={2} value={step}
                      onChange={(e) => this.handleRecipeChange(e.currentTarget.value, ['steps', i.toString()])}
                    />
                    <Button variant="primary" onClick={() => this.handleRemoveStep(i)}><FiTrash2 /></Button>
                  </div>
                </li>)}
              </ol>
              <Button variant="primary" onClick={this.handleAddStep}><FiPlusSquare /></Button>
            </Col>
          </Row>
        </Form>

        <Modal show={this.state.show[EModalEdit.CancelEdit]} onHide={() => this.handleClose(EModalEdit.CancelEdit)}>
          <Modal.Header>
            <Modal.Title>Annuler les modifications</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose(EModalEdit.CancelEdit)}>
              Fermer
            </Button>
            <Button variant="warning" onClick={this.handleCancel}>
              Continuer
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.show[EModalEdit.DeleteRecipe]} onHide={() => this.handleClose(EModalEdit.DeleteRecipe)}>
          <Modal.Header>
            <Modal.Title>Supprimer la recette</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>La suppression est définitive</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose(EModalEdit.DeleteRecipe)}>
              Fermer
            </Button>
            <Button variant="danger" onClick={this.handleDelete}>
              Continuer
            </Button>
          </Modal.Footer>
        </Modal>
      </Col>
    );
  }
}

export default withParams(RecipeFormEdit);