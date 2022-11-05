import React, { Component } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './views/home/Home';
import RecipeList from './views/recipeList/RecipeList';
import RecipeFormEdit from './views/recipeFormEdit/RecipeFormEdit';
import RecipeDetail from './views/recipeDetail/RecipeDetail';
import NotFound from './views/notFound/NotFound';
import { FiHome, FiPlusSquare, FiSearch, FiSettings } from 'react-icons/fi';
import './App.scss';
import { Container, Col, Image } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <Container fluid className="app p-0">
        <Col xs={2} className="border-end d-flex flex-column" id="navbar">
          <Link to="/app">
            <Image alt="Maite in the Pocket" src={`${process.env.PUBLIC_URL}/maite.jpg`}></Image>
          </Link>
          <Link to="/app"><FiHome size="1.3em" color="var(--mp-theme)"/> Home</Link>
          <Link to="/app/recipe/list"><FiSearch size="1.3em" color="var(--mp-theme)"/> Chercher une recette</Link>
          <Link reloadDocument to="/app/recipe/add"><FiPlusSquare size="1.3em" color="var(--mp-theme)"/> Ajouter une recette</Link>
          <Link to="/app/settings"><FiSettings size="1.3em" color="var(--mp-theme)"/> Paramètres</Link>
        </Col>
        <div id="appWrapper">
          <Routes>
            <Route index path="/app" element={<Home/>}></Route>
            <Route path="/app/recipe/list" element={<RecipeList/>}></Route>
            <Route path="/app/recipe/list/:currentPage" element={<RecipeList/>}></Route>
            <Route path="/app/recipe/add" element={<RecipeFormEdit addMode={true}/>}></Route>
            <Route path="/app/recipe/edit/:id" element={<RecipeFormEdit/>}></Route>
            <Route path="/app/recipe/detail/:id" element={<RecipeDetail/>}></Route>
            <Route path="/app/*" element={<NotFound/>} />
          </Routes>
        </div>
      </Container>
    );
  }
}

export default App;
