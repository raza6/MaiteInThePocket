import React, { Component } from 'react';
import { Row, Col, Stack, Image, Button, Modal } from 'react-bootstrap';
import { AiOutlineFire, AiOutlinePieChart } from 'react-icons/ai';
import { FiCheckSquare, FiClock, FiTrash2, FiXSquare } from 'react-icons/fi';
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
  show: Array<boolean>,
  currentModal: EModalEdit | undefined,
  navigate: string | undefined
}

class RecipeFormEdit extends Component<{ params: { id: string } }, RecipeFormEditState> {  
  constructor(props: { params: { id: string } }) {
    super(props);
    this.state = {
      recipe: undefined,
      show: new Array(2).fill(false),
      currentModal: undefined,
      navigate: undefined
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClose(currentModal: EModalEdit) {
    this.setState({ show: this.state.show.map((v, i) => i === currentModal ? false : v) });
  }

  handleShow(currentModal: EModalEdit) {
    this.setState({ show: this.state.show.map((v, i) => i === currentModal ? true : v) });
  }

  handleSubmit() {
    //await submit call
    this.setState({ navigate: `/app/recipe/detail/${this.state.recipe?.slugId}` });
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
        <h1>Modifier une recette</h1>
        <Stack id="recipeEditActionWrapper" direction="horizontal" gap={3}>
          <Button variant="success" onClick={this.handleSubmit}><FiCheckSquare /></Button>
          <Button variant="warning" onClick={() => this.handleShow(EModalEdit.CancelEdit)}><FiXSquare /></Button>
          <Button variant="danger" onClick={() => this.handleShow(EModalEdit.DeleteRecipe)}><FiTrash2 /></Button>
        </Stack>
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
            </Col>
            <Col id="recipeIngredientsWrapper">
              <h4>Ingrédients :</h4>
            </Col>
          </Row>
          <Row id="recipeStepsWrapper">
            <ol>
              {this.state.recipe?.steps.map((step, i) => <li key={'step_' + i}>{step}</li>)}
            </ol>
          </Row>
        </Col>

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