import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Button, Image, Form, InputGroup } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { FiLock, FiPlusSquare, FiSearch, FiSettings, FiUnlock } from 'react-icons/fi';
import AuthContext from '../../components/AuthContext';
import './Home.scss';
import { getRandomOfList } from '../../utils';
import { GenProps } from '../../types/generic';

function Home(props: GenProps) {
  // State
  const [search, setSearch] = useState('');
  const [navigate, setNavigate] = useState<string | undefined>(undefined);

  // Context
  const loggedIn = useContext(AuthContext);

  useEffect(() => {
    props.pageName('Maite in the Pocket');
  }, []);

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value;
    setSearch(search);
  };
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNavigate(`/app/recipe/list?search=${search}`);
  };

  return (
    <Col>
      {navigate && <Navigate to={navigate}/>}
      <h1 className="laptop">Maite in the Pocket</h1>
      <Container id="homeWrapper">
        <Row className="mobile">
          <Image alt="Maite in the Pocket" src={`${import.meta.env.BASE_URL}maite.jpg`}></Image>
        </Row>
        <Row>
          <Form onSubmit={handleSubmit}>
            <InputGroup id="searchBarWrapper">
              <Form.Control
                type="text" value={search} onInput={handleInput} maxLength={50}
                placeholder={getRandomOfList(['Lasagne', 'Pot au feu', 'Curry', 'Pizza', 'Navarin', 'Pancake'])}
              />
              <Button variant="outline-secondary" id="recipeSearchInput" type="submit">
                <FiSearch />
              </Button>
            </InputGroup>
          </Form>
        </Row>
        <Row id="linkWrapper">
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
          {
            loggedIn ? 
              <Col>
                <Link to="/app/logout" className="d-flex flex-column align-items-center">
                  <Button>
                    Se déconnecter
                    <FiLock/>
                  </Button>
                </Link>
              </Col> :
              <Col>
                <Link to="/app/login" className="d-flex flex-column align-items-center">
                  <Button>
                    Se connecter
                    <FiUnlock/>
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

export default Home;