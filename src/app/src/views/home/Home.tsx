import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiPlusSquare, FiSearch, FiSettings } from 'react-icons/fi';
import AuthContext from '../../components/AuthContext';
import './Home.scss';

class Home extends Component {
  render() {
    const loggedIn = this.context as boolean;
    return (
      <Col>
        <h1>Maite in the Pocket</h1>
        <Container id="homeWrapper">
          <Row>
            <Col>
              <Link to="/app/recipe/list" className="d-flex flex-column align-items-center">
                <Button>
                  Chercher une recette
                  <FiSearch />
                </Button>
              </Link>
            </Col>
            {
              loggedIn && 
              <Col>
                <Link to="/app/recipe/add" className="d-flex flex-column align-items-center">
                  <Button>
                    Ajouter une recette
                    <FiPlusSquare/>
                  </Button>
                </Link>
              </Col>
            }
            <Col>
              <Link to="/app/settings" className="d-flex flex-column align-items-center">
                <Button>
                  Paramètres
                  <FiSettings/>
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </Col>
    );
  }
}
Home.contextType = AuthContext;

export default Home;