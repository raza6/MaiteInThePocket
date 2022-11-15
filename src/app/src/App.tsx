import React, { Component } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './views/home/Home';
import RecipeList from './views/recipeList/RecipeList';
import RecipeFormEdit from './views/recipeFormEdit/RecipeFormEdit';
import RecipeDetail from './views/recipeDetail/RecipeDetail';
import NotFound from './views/notFound/NotFound';
import { FiHome, FiPlusSquare, FiSearch, FiSettings, FiMenu } from 'react-icons/fi';
import './App.scss';
import { Container, Col, Image, Button, Offcanvas } from 'react-bootstrap';

interface AppState {
  menuShow: boolean,
  appName: string,
  appVersion: string,
}

class App extends Component<{}, AppState> {
  constructor (props: {}) {
    super(props);
    this.state = {
      menuShow: false,
      appName: process.env.REACT_APP_NAME ?? '',
      appVersion: process.env.REACT_APP_VERSION ?? 'x.x.x',
    };

    console.log(process.env);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleShow() {
    this.setState({ menuShow: true });
  }

  handleClose() {
    this.setState({ menuShow: false });
  }

  render() {
    return (
      <Container fluid className="app" id="mainWrapper">
        <Col id="navbar">
          <Link to="/app">
            <Image alt="Maite in the Pocket" src={`${process.env.PUBLIC_URL}/maite.jpg`}></Image>
          </Link>
          <Button className="mobile" onClick={this.handleShow}>
            <FiMenu />
          </Button>
          <div className="laptop" id="laptopMenuWrapper">
            {this.renderMenuLink()}
          </div>
          <Offcanvas placement="end" show={this.state.menuShow} onHide={this.handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {this.renderMenuLink()}
            </Offcanvas.Body>
          </Offcanvas>
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

  renderMenuLink() {
    return (
      <div id="menuWrapper">
        <div id="menuLinkWrapper">
          <Link to="/app" onClick={this.handleClose}><FiHome /> Home</Link>
          <Link to="/app/recipe/list" onClick={this.handleClose}><FiSearch /> Chercher une recette</Link>
          <Link reloadDocument to="/app/recipe/add" onClick={this.handleClose}><FiPlusSquare /> Ajouter une recette</Link>
          <Link to="/app/settings" onClick={this.handleClose}><FiSettings /> Paramètres</Link>
        </div>
        <span className="versionWrapper">
          <a href="https://github.com/raza6/MaiteInThePocket">{this.state.appName} v{this.state.appVersion}</a>
        </span>
      </div>
    );
  }
}

export default App;
