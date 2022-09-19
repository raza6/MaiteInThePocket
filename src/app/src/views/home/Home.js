import { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { FiPlusSquare, FiSearch, FiSettings } from "react-icons/fi";

class Home extends Component {  
  render() {
    return (
      <div class="col">
        <Container>
          <Row>
            <Col>
              <Link to="/recipes/list" className="d-flex flex-column align-items-center">
                Chercher une recette
                <FiSearch />
              </Link>
            </Col>
            <Col>
              <Link to="/recipes/add" className="d-flex flex-column align-items-center">
                Ajouter une recette
                <FiPlusSquare/>
              </Link>
            </Col>
            <Col>
              <Link to="/settings" className="d-flex flex-column align-items-center">
                Paramètres
                <FiSettings/>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default Home;