import React, { Component } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './views/home/Home';
import RecipesList from './views/recipesList/RecipesList';
import RecipeForm from './views/recipeForm/RecipeForm';
import { FiHome, FiPlusSquare, FiSearch, FiSettings } from 'react-icons/fi';
import './App.scss';
import RecipeDetail from './views/recipeDetail/recipeDetail';
import { Container, Col, Image } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <Container fluid className="app p-0">
        <Col xs={2} className="border-end d-flex flex-column" id="navbar">
          <Link to="/">
            <Image alt="Maite in the Pocket" src="https://www.babelio.com/users/AVT_Maite_9546.jpg"></Image>
          </Link>
          <Link to="/"><FiHome size="1.3em" color="var(--mp-theme)"/> Home</Link>
          <Link to="/recipe/list"><FiSearch size="1.3em" color="var(--mp-theme)"/> Chercher une recette</Link>
          <Link to="/recipe/add"><FiPlusSquare size="1.3em" color="var(--mp-theme)"/> Ajouter une recette</Link>
          <Link to="/settings"><FiSettings size="1.3em" color="var(--mp-theme)"/> Paramètres</Link>
        </Col>
        <div id="appWrapper">
          <Routes>
            <Route index path="/" element={<Home/>}></Route>
            <Route path="/recipe/list" element={<RecipesList/>}></Route>
            <Route path="/recipe/list/:currentPage" element={<RecipesList/>}></Route>
            <Route path="/recipe/add" element={<RecipeForm/>}></Route>
            <Route path="/recipe/edit" element={<RecipeForm/>}></Route>
            <Route path="/recipe/detail/:id" element={<RecipeDetail/>}></Route>
          </Routes>
        </div>
      </Container>
    );
  }
}

export default App;
