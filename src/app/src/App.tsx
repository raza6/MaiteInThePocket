import { Component } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './views/home/Home';
import RecipesList from './views/recipesList/RecipesList';
import RecipeForm from './views/recipeForm/RecipeForm';
import { FiHome, FiPlusSquare, FiSearch, FiSettings } from 'react-icons/fi';
import './App.scss';
import RecipeDetail from './views/recipeDetail/recipeDetail';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="row">
          <div className="col-2 border-end d-flex flex-column" id="navbar">
            <Link to="/">
              <img alt="Maite in the Pocket" src="https://www.babelio.com/users/AVT_Maite_9546.jpg"/>
            </Link>
            <Link to="/"><FiHome size="1.3em" color="var(--mp-theme)"/> Home</Link>
            <Link to="/recipe/list"><FiSearch size="1.3em" color="var(--mp-theme)"/> Chercher une recette</Link>
            <Link to="/recipe/add"><FiPlusSquare size="1.3em" color="var(--mp-theme)"/> Ajouter une recette</Link>
            <Link to="/settings"><FiSettings size="1.3em" color="var(--mp-theme)"/> Paramètres</Link>
          </div>
          <Routes>
            <Route index path="/" element={<Home/>}></Route>
            <Route path="/recipe/list" element={<RecipesList/>}></Route>
            <Route path="/recipe/add" element={<RecipeForm/>}></Route>
            <Route path="/recipe/edit" element={<RecipeForm/>}></Route>
            <Route path="/recipe/:id" element={<RecipeDetail/>}></Route>
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
