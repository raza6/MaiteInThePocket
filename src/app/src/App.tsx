import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './views/home/Home';
import RecipeList from './views/recipeList/RecipeList';
import RecipeFormEdit from './views/recipeFormEdit/RecipeFormEdit';
import RecipeDetail from './views/recipeDetail/RecipeDetail';
import NotFound from './views/notFound/NotFound';
import { FiHome, FiPlusSquare, FiSearch, FiSettings, FiMenu } from 'react-icons/fi';
import './App.scss';
import { Container, Col, Image, Button, Offcanvas } from 'react-bootstrap';
import Login from './views/auth/login/Login';
import AuthContext from './components/AuthContext';
import AuthService from './services/authService';

function App() {
  const [menuShow, setMenuShow] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [pageName, setPageName] = useState('Maite in the Pocket');
  const [appName] = useState(process.env.REACT_APP_NAME ?? '');
  const [appVersion] = useState(process.env.REACT_APP_VERSION ?? 'x.x.x');

  const handleLoginCheck = async () => {
    const res = await AuthService.checkAuth();
    setLoggedIn(res);
  };

  useEffect(() => {
    handleLoginCheck();
  }, []);

  const handleShow = () => {
    setMenuShow(true);
  };

  const handleClose = () => {
    setMenuShow(false);
  };

  const renderMenuLink = () => {
    return (
      <div id="menuWrapper">
        <div id="menuLinkWrapper">
          <Link to="/app" onClick={handleClose}><FiHome /> Accueil</Link>
          <Link to="/app/recipe/list" onClick={handleClose}><FiSearch /> Chercher une recette</Link>
          {loggedIn && 
            <Link reloadDocument to="/app/recipe/add" onClick={handleClose}><FiPlusSquare /> Ajouter une recette</Link>
          }
          <Link to="/app/settings" onClick={handleClose}><FiSettings /> Paramètres</Link>
        </div>
        <span className="versionWrapper">
          <span>{loggedIn ? 'Logged in' : 'Logged out'}</span>
          <a href="https://github.com/raza6/MaiteInThePocket">{appName} v{appVersion}</a>
        </span>
      </div>
    );
  };

  return (
    <AuthContext.Provider value={loggedIn}>
      <Container fluid className="app" id="mainWrapper">
        <Col id="navbar">
          <Link to="/app" className="laptop">
            <Image alt="Maite in the Pocket" src={`${process.env.PUBLIC_URL}/maite.jpg`}></Image>
          </Link>
          <Button className="mobile" onClick={handleShow}>
            <FiMenu />
          </Button>
          <h1 className="mobile">{pageName}</h1>
          <Link className="mobile" to="/app/recipe/list">
            <Button>
              <FiSearch />
            </Button>
          </Link>
          <div className="laptop" id="laptopMenuWrapper">
            {renderMenuLink()}
          </div>
          <Offcanvas placement="start" show={menuShow} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {renderMenuLink()}
            </Offcanvas.Body>
          </Offcanvas>
        </Col>
        <div id="appWrapper">
          <Routes>
            <Route index path="/app" element={<Home pageName={setPageName}/>}></Route>
            <Route path="/app/login" element={<Login pageName={setPageName}/>}></Route>
            <Route path="/app/recipe/list" element={<RecipeList pageName={setPageName}/>}></Route>
            <Route path="/app/recipe/list/:currentPage" element={<RecipeList pageName={setPageName}/>}></Route>
            <Route path="/app/recipe/add" element={<RecipeFormEdit addMode={true} pageName={setPageName}/>}></Route>
            <Route path="/app/recipe/edit/:id" element={<RecipeFormEdit pageName={setPageName}/>}></Route>
            <Route path="/app/recipe/detail/:id" element={<RecipeDetail pageName={setPageName}/>}></Route>
            <Route path="/app/*" element={<NotFound pageName={setPageName}/>} />
          </Routes>
        </div>
      </Container>
    </AuthContext.Provider>
  );
}

export default App;
