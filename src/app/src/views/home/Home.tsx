import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiPlusSquare, FiSearch, FiSettings } from 'react-icons/fi';
import './Home.scss';

class Home extends Component {  
  render() {
    return (
      <Col>
        <h1>Maite in the Pocket</h1>
        <Container id="homeWrapper">
          <Row>
            <Col>
              <Link to="/app/recipe/list" className="d-flex flex-column align-items-center">
                Chercher une recette
                <FiSearch />
              </Link>
            </Col>
            <Col>
              <Link to="/app/recipe/add" className="d-flex flex-column align-items-center">
                Ajouter une recette
                <FiPlusSquare/>
              </Link>
            </Col>
            <Col>
              <Link to="/app/settings" className="d-flex flex-column align-items-center">
                Paramètres
                <FiSettings/>
              </Link>
            </Col>
          </Row>
        </Container>
      </Col>
    );
  }
}

export default Home;