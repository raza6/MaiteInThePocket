import { Component } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './views/home/Home';
import RecipesList from './views/recipesList/RecipesList';
import RecipeForm from './views/recipeForm/RecipeForm';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div class="app">
        <div class="row">
          <div class="col-2 border-end d-flex flex-column">
            <Link to="/">Home</Link>
            <Link to="/recipes/list">Chercher une recette</Link>
            <Link to="/recipes/add">Ajouter une recette</Link>
            <Link to="/settings">Paramètres</Link>
          </div>
          <Routes>
            <Route index path="/" element={<Home/>}></Route>
            <Route path="/recipes" element={<RecipesList/>}></Route>
            <Route path="/recipes/add" element={<RecipeForm/>}></Route>
            <Route path="/recipes/edit" element={<RecipeForm/>}></Route>
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
