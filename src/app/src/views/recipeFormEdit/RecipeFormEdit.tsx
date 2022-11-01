import React, { Component } from 'react';
import { Row, Col, Stack, Image, Button, Modal, Form, Alert } from 'react-bootstrap';
import { AiOutlineFire, AiOutlinePieChart } from 'react-icons/ai';
import { FiCheckSquare, FiClock, FiImage, FiPlusSquare, FiTrash2, FiXSquare } from 'react-icons/fi';
import { Navigate } from 'react-router-dom';
import MainService from '../../services/mainService';
import { Recipe } from '../../types/recipes';
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
  }

  handleRecipeChange(value: string, recipeProperty: Array<string>) {
    const newRecipe: Recipe = JSON.parse(JSON.stringify(this.state.recipe));
    if (recipeProperty[0] === 'summary') {
      if (recipeProperty[1] === 'name') {
        newRecipe.summary.name = value.trim();
      } else if (recipeProperty[1] === 'servings') {
        newRecipe.summary.servings = parseInt(value, 10);
      } else if (recipeProperty[1] === 'cookingTime') {
        newRecipe.summary.cookingTime = parseInt(value, 10);
      } else if (recipeProperty[1] === 'prepTime') {
        newRecipe.summary.prepTime = parseInt(value, 10);
      }
    } else if (recipeProperty[0] === 'steps'){
      newRecipe.steps[parseInt(recipeProperty[1], 10)] = value;
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
    if (this.state.recipeImg !== undefined) {
      const recipeId = this.state.recipe?.slugId ?? '';
      const recipeImg = this.state.recipeImg ?? new File([], '');
      await MainService.addImgRecipe(recipeId, recipeImg);
    }
    setTimeout(() => {
      this.setState({ navigate: `/app/recipe/detail/${this.state.recipe?.slugId}` });
    }, 300);
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
            </Col>
            <Col id="recipeIngredientsWrapper">
              <h4>Ingrédients :</h4>
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