import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FiPlusSquare } from 'react-icons/fi';

class RecipesFormAdd extends Component {  
  render() {
    return (
      <div className="col">
        <h1>Ajouter une recette</h1>
        <Form>
          <Button>Ajouter <FiPlusSquare/></Button>
        </Form>
      </div>
    );
  }
}

export default RecipesFormAdd;