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
}

class App extends Component<{}, AppState> {
  constructor (props: {}) {
    super(props);
    this.state = {
      menuShow: false,
    };

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
          <div className="laptop">
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
      <div id="menuLinkWrapper">
        <Link to="/app"><FiHome /> Home</Link>
        <Link to="/app/recipe/list"><FiSearch /> Chercher une recette</Link>
        <Link reloadDocument to="/app/recipe/add"><FiPlusSquare /> Ajouter une recette</Link>
        <Link to="/app/settings"><FiSettings /> Paramètres</Link>
      </div>
    );
  }
}

export default App;
