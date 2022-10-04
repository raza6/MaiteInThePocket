import { Component } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './views/home/Home';
import RecipesList from './views/recipesList/RecipesList';
import RecipeForm from './views/recipeForm/RecipeForm';
import { FiHome, FiPlusSquare, FiSearch, FiSettings } from 'react-icons/fi';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div class="app">
        <div class="row">
          <div class="col-2 border-end d-flex flex-column" id="navbar">
            <Link to="/">
              <img alt="Maite in the Pocket" src="https://www.babelio.com/users/AVT_Maite_9546.jpg"/>
            </Link>
            <Link to="/"><FiHome size="1.3em" color="var(--mp-theme)"/> Home</Link>
            <Link to="/recipes/list"><FiSearch size="1.3em" color="var(--mp-theme)"/> Chercher une recette</Link>
            <Link to="/recipes/add"><FiPlusSquare size="1.3em" color="var(--mp-theme)"/> Ajouter une recette</Link>
            <Link to="/settings"><FiSettings size="1.3em" color="var(--mp-theme)"/> Paramètres</Link>
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
