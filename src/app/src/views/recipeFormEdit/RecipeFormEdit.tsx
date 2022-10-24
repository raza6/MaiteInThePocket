import React, { Component } from 'react';
import { Row, Col, Stack, Image, Button, Modal } from 'react-bootstrap';
import { AiOutlineFire, AiOutlinePieChart } from 'react-icons/ai';
import { FiCheckSquare, FiClock, FiTrash2, FiXSquare } from 'react-icons/fi';
import MainService from '../../services/mainService';
import { Recipe } from '../../types/recipes';
import { getRecipeImg, withParams } from '../../utils';
import './RecipeFormEdit.scss';

class RecipesFormEdit extends Component<{ params: { id: string } }, { recipe: Recipe | undefined, show: boolean }> {  
  constructor(props: { params: { id: string } }) {
    super(props);
    this.state = {
      recipe: undefined,
      show: false,
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  async componentDidMount() {
    const { id } = this.props.params;
    const recipe = await MainService.getRecipe(id);
    this.setState({ recipe });
  }
  
  // FORM IN MODAL
  render() {
    return (
      <Col id="recipeEditWrapper">
        <h1>Modifier une recette</h1>
        <Stack id="recipeEditActionWrapper" direction="horizontal" gap={3}>
          <Button variant="success"><FiCheckSquare /></Button>
          <Button variant="warning" onClick={() => this.handleShow()}><FiXSquare /></Button>
          <Button variant="danger"><FiTrash2 /></Button>
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

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Annuler les modifications</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Fermer
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Continuer
            </Button>
          </Modal.Footer>
        </Modal>
      </Col>
    );
  }
}

export default withParams(RecipesFormEdit);